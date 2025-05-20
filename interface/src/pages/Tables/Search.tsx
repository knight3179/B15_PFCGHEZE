import { useState, useEffect, useRef } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../server/firestore";
import { useTranslation } from 'react-i18next';

function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clean up old listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    if (value.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const productsRef = collection(db, "product");
    const q = query(productsRef, where("Product.name", "==", value));

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setResults(products);
    });
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") openModal();
  };

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
          <svg
            className="fill-gray-500 dark:fill-gray-400"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder={t("Search for a product...")}
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
        />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-20"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg w-80 p-4 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              &times;
            </button>
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((product) => (
                  <div key={product.id} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-white">
                    <div><strong>{product.Product.name}</strong></div>
                    <div>Category: {product.Product.category}</div>
                    <div>Price: {product.price}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 dark:text-white">No products found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchForm;
