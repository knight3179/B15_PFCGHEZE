import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

// Product type definition
interface Product {
  id: number;
  name: string;
  variants: string;
  category: string;
  price: string;
  status: "Delivered" | "Pending" | "Canceled";
  image: string;
}

// Sample product data
const tableData: Product[] = [
  {
    id: 1,
    name: "Saint Lauren",
    variants: "2 Variants",
    category: "Perfume",
    price: "28000 DA",
    status: "Delivered",
    image: "/images/product/SL.jpg",
  },
  {
    id: 2,
    name: "Nars",
    variants: "1 Variant",
    category: "Foundation",
    price: "12900 DA",
    status: "Pending",
    image: "/images/product/NARS.jpg",
  },
  {
    id: 3,
    name: "Nivea",
    variants: "2 Variants",
    category: "Stick",
    price: "850 DA",
    status: "Delivered",
    image: "/images/product/Nivea.jpg",
  },
  {
    id: 4,
    name: "Renee",
    variants: "2 Variants",
    category: "Lip Stick",
    price: "1400 DA",
    status: "Canceled",
    image: "/images/product/Renee.jpg",
  },
  {
    id: 5,
    name: "Size Up",
    variants: "1 Variant",
    category: "Mascara",
    price: "3300 DA",
    status: "Delivered",
    image: "/images/product/sizeUP.jpg",
  },
];

// Calculate total price
const calculateTotalPrice = (products: Product[]): number => {
  return products.reduce((total, product) => {
    const price = parseFloat(product.price.replace(' DA', '').replace(',', '.'));
    return total + price;
  }, 0);
};

export default function RecentOrders() {
  const { t } = useTranslation();
  const totalPrice = calculateTotalPrice(tableData);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("Recent Orders")}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("Filter")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("See all")}
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Products")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Price")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Category")}
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("Status")}
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img src={product.image} className="h-[50px] w-[50px]" alt={product.name} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.variants}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Delivered"
                        ? "success"
                        : product.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {t(product.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Total Ticket Section */}
      <div className="mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.02] max-w-xs mx-auto text-center">
        <h4 className="text-md font-semibold text-gray-700 dark:text-white">Elanora</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">Total Price</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{totalPrice.toLocaleString()} DA</p>
        <div className="mt-3 mx-auto w-24 h-24">
          <QRCode value={`Elanora - Total: ${totalPrice.toLocaleString()} DA`} size={96} />
        </div>
      </div>
    </div>
  );
}

