import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProductTable from "../../components/tables/BasicTables/ProductTable";
import { useTranslation } from 'react-i18next';
import SearchForm from "./Search";

export default function BasicTables() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title="ELANORA"
        description="cosmetique stock managment "
      />
     
      <PageBreadcrumb pageTitle={t("Table")} />
      

      <div className="space-y-6">
        <ComponentCard title="Stock">
          
          <SearchForm/>
          <ProductTable />
        </ComponentCard>
      </div>
    </>
  );
}
