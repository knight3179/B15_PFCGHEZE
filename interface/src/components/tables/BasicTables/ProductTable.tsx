import { useState, useEffect,useMemo,useRef } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import { useTranslation } from 'react-i18next';
import AddProduct from "./AddProduct";
import DeleteProduct from "./DeleteProduct";
import ProductRow from "./Row";
import { Order } from "./types";
import TagScan from "./TagScan";
import { useNotifications } from "../../header/NotificationContext"; // Import the hook

// Cache key constant
const PRODUCTS_CACHE_KEY = "products_data";
const productMap: Record<string, string> = {
  "63980E90": "Stronger With you",
  "33563AAF": "Renee",
  "B32E3591": "NARS",
  "33E41EAF": "Nivea",
  "F3C29FF7": "Saint Laurent",
};


export default function ProductTable() {
  const [deleteMode, setDeleteMode] = useState(false);
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const { addNotification } = useNotifications();
const [scannedItems, setScannedItems] = useState<Set<string>>(new Set());
  const [tableData, setTableData] = useState<Order[]>(() => {
    // Initialize state from cache if available
    const cachedData = localStorage.getItem(PRODUCTS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : [
      {
        id: 1,
        uid : "F3C29FF7",
        Product: {
          image: "/images/product/SL.jpg",
          name: "Saint Lauren",
          category: "Perfume",
        },
        manufacturing: "2020",
        expirationDate: "2025",
        validation: "19-04-2025 12:00",
        quantity: 10, // Changed from string to number
        price: "500 DA",
      },
      {
        id: 2,
        uid : "B32E3591",
        Product: {
          image: "/images/product/NARS.jpg",
          name: "NARS",
          category: "Foundation",
        },
        manufacturing: "2020",
        expirationDate: "2025",
        validation: "19-04-2025 12:00",
        quantity: 10,
        price: "500 DA",
      },
      {
        id: 3,
        uid : "33E41EAF",
        Product: {
          image: "/images/product/Nivea.jpg",
          name: "Nivea",
          category: "Stick",
        },
        manufacturing: "2020",
        expirationDate: "2025",
        validation: "19-04-2025 12:00",
        quantity: 10,
        price: "500 DA",
      },
      {
        id: 4,
        uid : "33563AAF",
        Product: {
          image: "/images/product/Renee.jpg",
          name: "Renee",
          category: "Lip Stick",
        },
        manufacturing: "2020",
        expirationDate: "2025",
        validation: "19-04-2025 12:00",
        quantity: 10,
        price: "500 DA",
      },
      {
        id: 5,
        uid : "63980E90",
        Product: {
          image: "/images/product/sizeUP.jpg",
          name: "Size Up",
          category: "Mascara",
        },
        manufacturing: "2020",
        expirationDate: "2025",
        validation: "19-04-2025 12:00",
        quantity: 10,
        price: "500 DA",
      }
    ];
  });
  const currentQuantities = useMemo(() => {
    console.log("Recalculating quantities..."); // Debug log
    
    const quantities: Record<string, number> = {};
    let hasErrors = false;
  
    tableData.forEach(product => {
      if (!product.uid) {
        console.error(`❌ Missing UID for product ${product.id}`);
        hasErrors = true;
        return;
      }
      
      if (!(product.uid in productMap)) {
        console.error(`❌ UID ${product.uid} not found in productMap`);
        hasErrors = true;
        return;
      }
  
      quantities[product.uid] = product.quantity;
    });
  
    if (hasErrors) {
      console.error("Found problems in product data. Current state:", {
        productMapKeys: Object.keys(productMap),
        tableDataUids: tableData.map(p => p.uid)
      });
    }
  
    console.log("Final quantities:", quantities);
    return quantities;
  }, [tableData, productMap]); // Add productMap to dependencies
  // Save to cache whenever tableData changes
  useEffect(() => {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleAddProduct = (newProduct: Omit<Order, "id">) => {
    // Generate a unique ID (using timestamp for better uniqueness)
    const newId = Date.now();
    const updatedData = [...tableData, { id: newId, ...newProduct }];
    setTableData(updatedData);
  };

  const handleProductScanned = (uid: string) => {
    const normalizedUid = uid.toUpperCase();
    const scanTimestamp = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const productName = productMap[normalizedUid];
    if (!productName) return;
    
  
    // Trigger glow effect using product name
    setScannedItems(prev => new Set(prev).add(productName));
    
    // Remove glow after 1.5 seconds
    setTimeout(() => {
      setScannedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productName);
        return newSet;
      });
    }, 1500);
  
    // Update quantity
    setTableData(prevData => {
      const updatedData = prevData.map(item => {
        if (item.Product.name === productName) {
          const newQuantity = Math.max(0, item.quantity - 1);
          
          // Check if we need to send a beep
          if (newQuantity <= 3 && wsRef.current?.readyState === WebSocket.OPEN) {
            addNotification(productName, newQuantity);
            const message = { 
              type: "beep", 
              duration: 1500 
            };
            wsRef.current.send(JSON.stringify(message));
            console.log("Beep command sent successfully");
          }
          
          return { 
            ...item, 
            quantity: newQuantity,
            validation: scanTimestamp
          };
        }
        return item;
      });
      return updatedData;
    });
  };
  useEffect(() => {
    // Replace with your WebSocket server URL
    wsRef.current = new WebSocket('ws://192.168.100.8:8080');
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <TagScan 
        productMap={productMap}
        currentQuantities={currentQuantities}
        onProductScanned={handleProductScanned}
        
      />
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {deleteMode && (
                <TableCell isHeader className="px-4 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === tableData.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(tableData.map((item) => item.id.toString()));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </TableCell>
              )}
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Product")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Manufacturing")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Expiration Date")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Validation")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Quantity")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Price")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((order) => (
              <ProductRow
                key={order.id}
                order={order}
                deleteMode={deleteMode}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                setTableData={setTableData}
                scannedItems={scannedItems}
              />
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-2 my-4 justify-center items-center">
          <AddProduct onAdd={handleAddProduct} />
        </div>
        <div className="flex gap-2 my-4 justify-center items-center">
          <DeleteProduct
            tableData={tableData}
            setTableData={setTableData}
            deleteMode={deleteMode}
            setDeleteMode={setDeleteMode}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </div>
    </div>
  );
}