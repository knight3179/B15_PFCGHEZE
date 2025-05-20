import { useState, useEffect } from "react";

const productMap: Record<string, string> = {
    "63980E90": "Stronger With You",
    "33563AAF": "Renee",
    "B32E3591": "NARS",
    "33E41EAF": "Nivea",
    "F3C29FF7": "Saint Laurent",
};

const initialInventory: Record<string, { product: string, quantity: number }> = {
    "63980E90": { product: "Stronger With You", quantity: 5 },
    "33563AAF": { product: "Renee", quantity: 5 },
    "B32E3591": { product: "NARS", quantity: 5 },
    "33E41EAF": { product: "Nivea", quantity: 5 },
    "F3C29FF7": { product: "Saint Laurent", quantity: 5 },
};

export default function TagScan() {
  const [scans, setScans] = useState<{ uid: string; product: string; quantity: number }[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const [inventory, setInventory] = useState(initialInventory);

    useEffect(() => {
        const socket = new WebSocket("wss://webserver-hduc.onrender.com");

        socket.onmessage = async (event) => {
            let data;
            if (event.data instanceof Blob) {
                const text = await event.data.text();
                data = JSON.parse(text);
            } else {
                data = JSON.parse(event.data);
            }

            console.log("✅ Data received:", data);
            const { uid } = data;
            const product = productMap[uid] || "Unknown Product";

            // Decrease the quantity of the scanned product
            const updatedInventory = { ...inventory };
            if (updatedInventory[uid]) {
                updatedInventory[uid].quantity -= 1;

                
                if (updatedInventory[uid].quantity === 5) {
                  socket.send(JSON.stringify({ action: 'beep', uid }));
                  console.log("send action");
                }
                setInventory(updatedInventory);
                setScans(prev => [{ uid, product, quantity: updatedInventory[uid].quantity }, ...prev]);

            }
            // Highlight the new scan
      setHighlightedIndex(0);
      setTimeout(() => setHighlightedIndex(null), 1000); // remove highlight after 1s
      // Play sound
      const audio = new Audio("/_beep_.mp3");
      audio.play();
      
        };

        return () => socket.close();
    }, [inventory]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white dark:drop-shadow-lg">
                RFID Scans
            </h1>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
        Total scans: {scans.length}
      </p>

            <ul>
                {scans.map((scan, index) => (
                    <li key={index}  className={`mb-2 p-2 border rounded dark:text-white dark:drop-shadow-lg${
              index === highlightedIndex ? "bg-green-200 dark:bg-green-700" : ""
            }`}>
                        <strong>{scan.product}</strong> <br />
                        UID: {scan.uid} <br />
                        Quantity: {scan.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
