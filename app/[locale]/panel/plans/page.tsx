import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import PlansDataTable from "./data-table";

export default function Page() {
 
  return (
    <div className="page">
      <PageHeader t_key="plans" 
      // right={<Button>Add Plan</Button>}
       />
       <PlansDataTable />
    </div>
  );
}
