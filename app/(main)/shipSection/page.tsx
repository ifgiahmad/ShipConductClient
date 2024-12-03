"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { getMsShipSection } from "@/services/service_api_shipSection";
import DataTableShipSection from "@/components/Data-Table/data-table-shipSection";
import ShipSectionForm from "./shipSectionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<MsShipSection>[] = [
  { header: "Vessel Type", accessorKey: "vslType" },
  { header: "Ship Section", accessorKey: "sectionName" },
  { header: "Category Section", accessorKey: "categorySection" },
];

const ShipSectionPage: React.FC = () => {
  const [data, setData] = useState<MsShipSection[]>([]);

  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMsShipSection();
    console.log(result);
    setData(result);
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>List Data Ship Section</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        <Card>
          <CardContent>
            <DataTableShipSection
              data={data}
              columns={columns}
              modalContent={
                <ShipSectionForm
                  onClose={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  onSave={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  id={0}
                  mode=""
                />
              }
              onSaveData={() => handleSaveDetail()}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ShipSectionPage;
