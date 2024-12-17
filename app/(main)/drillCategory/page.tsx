"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MsDrillCategory } from "@/lib/types/MsDrillCategory.types";
import { getMsDrillCategory } from "@/services/service_api_drillCategory";
import DataTableDrillCategory from "@/components/Data-Table/data-table-drillCategory";
import DrillCategoryForm from "./drillCategoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<MsDrillCategory>[] = [
  { header: "Vessel Type", accessorKey: "vslType" },
  { header: "Item", accessorKey: "itemDrill" },
  { header: "Interval", accessorKey: "interval" },
  { header: "Start Month", accessorKey: "startMonthString" },
];

const DrillCategoryPage: React.FC = () => {
  const [data, setData] = useState<MsDrillCategory[]>([]);

  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMsDrillCategory();
    setData(result);
  };

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>List Data Drill Category</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <DataTableDrillCategory
            data={data}
            columns={columns}
            modalContent={
              <DrillCategoryForm
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
  );
};

export default DrillCategoryPage;
