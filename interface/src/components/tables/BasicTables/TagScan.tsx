import { useState, useEffect, useRef } from "react";
import { Table, TableBody, TableCell, TableRow } from "../../ui/table";
import Badge from "../../../components/ui/badge/Badge";

interface ScanItem {
  uid: string;
  productName: string;
  scanTime: Date;
  validation: string; // Made required
  quantity?: number; // Optional, if you want to show quantity in the scan history
}

interface TagScanProps {
  productMap: Record<string, string>;
  currentQuantities: Record<string, number>;
  onProductScanned: (uid: string) => void;
}

export default function TagScan({ 
  productMap, 
  currentQuantities,
  onProductScanned 
}: TagScanProps) {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);

  const setupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const socket = new WebSocket("ws://192.168.100.8:8080");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
      socket.send(JSON.stringify({ type: "react_client" }));
    };

    socket.onclose = (event) => {
      console.error("❌ WebSocket closed:", event.code, event.reason);
      setIsConnected(false);
      
      const delay = Math.min(30000, 3000 * Math.pow(2, reconnectAttemptRef.current));
      reconnectAttemptRef.current++;
      setTimeout(setupWebSocket, delay);
    };

    socket.onmessage = async (event) => {
      const data = typeof event.data === 'string' 
        ? JSON.parse(event.data) 
        : JSON.parse(await event.data.text());

      if (data.uid) {
        const uid = data.uid;
        const productName = productMap[uid] || "Unknown Product";
        const scanTime = new Date();
        const validation = scanTime.toLocaleString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        const currentQty = currentQuantities[uid] || 0;

        new Audio("/_beep_.mp3").play();
        onProductScanned(uid);
        
        setScans(prev => [
          {
            uid,
            productName,
            scanTime,
            quantity: currentQty,
            validation
          },
          ...prev.slice(0, 4) // Keep last 5 scans
        ]);
      }
    };
  };

  useEffect(() => {
    setupWebSocket();
    return () => wsRef.current?.close();
  }, [productMap, onProductScanned]);

  // Add debug effect
  useEffect(() => {
    console.log('Received quantities:', currentQuantities);
  }, [currentQuantities]);

  return (
    <div className="tag-scan-container p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold dark:text-white">Recent Scans</h3>
        <Badge size="sm" color={isConnected ? "success" : "error"}>
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </div>
      
      <Table className="min-w-full">
        <TableBody>
          {scans.map((scan, index) => (
            <TableRow key={`${scan.uid}-${index}`} className="bg-white dark:bg-gray-700">
              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
                  <div>
                    <span className="block font-medium text-gray-800 dark:text-white/90">
                      {scan.productName}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      UID: {scan.uid}
                    </span>
                    <span className={`block text-theme-xs ${
                      (currentQuantities[scan.productName] ?? 0) <= 3 ? 
                        'text-red-500 font-medium' : 
                        'text-gray-500'
                    }`}>
                      
                    </span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400">
                <Badge size="sm" color={index === 0 ? "success" : "info"}>
                  {index === 0 ? "Just Scanned" : "Previous Scan"}
                </Badge>
              </TableCell>
              
              <TableCell className="px-4 py-3 text-right">
                <div className="flex flex-col">
                  <span className="text-gray-500 dark:text-gray-400 text-theme-xs">
                    Scanned: {scan.scanTime.toLocaleTimeString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-theme-xs">
                    Validated: {scan.validation}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {scans.length === 0 && (
            <TableRow>
              <TableCell  className="text-center py-4 text-gray-500">
                No scans yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}