"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { getMsInterval } from "@/services/service_api_interval";
import DataTableInterval from "@/components/Data-Table/data-table-interval";
import IntervalForm from "./intervalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<MsInterval>[] = [
  { header: "Interval", accessorKey: "interval" },
  { header: "Value", accessorKey: "value" },
];

const IntervalPage: React.FC = () => {
  const [data, setData] = useState<MsInterval[]>([]);

  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMsInterval();
    setData(result);
  };

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>List Data Interval</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <DataTableInterval
            data={data}
            columns={columns}
            modalContent={
              <IntervalForm
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

export default IntervalPage;
