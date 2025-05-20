import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useTranslation } from 'react-i18next';
export default function Items() {
  const { t } = useTranslation();
  interface Card{
    id: number; 
  name: string; 
  price: string;
  image: string;
  status:"New" | "Limited" | "Bestseller" ;

  }
  const productCards: Card[] = [
    {
      id: 1,
      name: "YSL ",
      price: "20 500 DA",
      image: "/images/product/ysl.jpg",
      status: "Bestseller",
    },
    {
      id: 2,
      name: "NARS",
      price: "12 900 DA",
      image: "/images/product/NARS.jpg",
      status: "Limited",
    },
    {
      id: 3,
      name: "Nivea",
      price: "850 DA",
      image: "/images/product/Nivea.jpg",
      status: "New",
    },
    {
      id: 4,
      name: "Renee",
      price: "1400 DA",
      image: "/images/product/Renee.jpg",
      status: "Limited",
    },
    {
      id: 5,
      name: "Size Up",
      price: "49 000 DA",
      image: "/images/product/sizeUP.jpg",
      status: "Limited",
    },
    {
      id: 6,
      name: "SL ",
      price: "20 500 DA",
      image: "/images/product/SL.jpg",
      status: "Bestseller",
    },
    {
      id: 7,
      name: "Stronger With you ",
      price: "20 500 DA",
      image: "/images/product/with.jpg",
      status: "Limited",
    },
    {
      id: 8,
      name: "Victoria's Secret ",
      price: "20 500 DA",
      image: "/images/product/victoria.jpg",
      status: "Bestseller",
    },
    {
      id: 9,
      name: "BYS ",
      price: "20 500 DA",
      image: "/images/product/bys.jpg",
      status: "New",
    },
    {
      id: 10,
      name: "Match ",
      price: "20 500 DA",
      image: "/images/product/match.jpg",
      status: "New",
    },
  ];

  return (
    <>
      <PageMeta
        title="ELANORA"
        description="cosmetique stock managment "
      />
      <PageBreadcrumb pageTitle={t("Product")} />
  
      {/* Cards Section */}
      <div className="flex flex-wrap justify-center gap-4">
        {productCards.map((Card) => (
          <div
            key={Card.id}
            className="inline-block rounded-2xl border border-gray-200 bg-white px-2 pb-2 pt-2 dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div>
              <img
                src={Card.image}
                alt={Card.name}
                className="w-[150px] h-[150px] object-cover rounded-xl mx-auto"
              />
            </div>
  
            <div className="mt-3 space-y-1 text-center">
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                {Card.name}
              </p>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                {Card.price}
              </span>
              <div>
                <Badge
                  size="sm"
                  color={
                    Card.status === "New"
                      ? "success"
                      : Card.status === "Bestseller"
                      ? "warning"
                      : "error"
                  }
                >
                  {t(Card.status)}
                </Badge>
              </div>
            </div>
  
            <a
              href="/"
              className="mt-3 block text-center text-sm font-medium underline"
              style={{ color: "#5771ff" }}
            >
              {t("Buy Now")}
            </a>
          </div>
        ))}
      </div>
  
      {/* Video Section with Margin Top */}
      <div className="mt-10 max-w-4xl mx-auto flex flex-col md:flex-row rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
        {/* Video */}
        <div className="w-full md:w-1/2">
          <video
            src="/images/product/ads.mp4"
            controls
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Description */}
        <div className="w-full md:w-1/2 bg-white dark:bg-white/[0.03] p-6 flex flex-col justify-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            ✨ {t("Featured Product")}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("Discover elegance...")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {t("Whether you're...")}
          </p>
          <a href="/" className="text-[#5771ff] underline text-sm font-medium mt-2 inline-block">
            {t("Explore full collection")} →
          </a>

        </div>
        
      </div>
    </>
  )
  
}