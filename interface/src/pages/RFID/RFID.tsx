import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
//import { useTranslation } from 'react-i18next';
import TagScan from "../../components/Rfid/RF_Product";

export default function Rfid() {
    return(
        <>
        <PageMeta
        title="ELANORA"
        description="cosmetique stock managment "
      />
      <PageBreadcrumb pageTitle="RFID" />
      <div className="space-y-6">
        <ComponentCard title="RFID">
        <TagScan/>
          
          
        </ComponentCard>
      </div>
        </>
    )
}
