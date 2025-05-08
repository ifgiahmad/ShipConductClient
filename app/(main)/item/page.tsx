"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MsItem } from "@/lib/types/MsItem.types";
import { getMsItem } from "@/services/service_api_item";
import DataTableItem from "@/components/Data-Table/data-table-item";
import ItemForm from "./itemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<MsItem>[] = [
  { header: "Item Name", accessorKey: "itemName" },
  { header: "Type", accessorKey: "type" },
  /* {
    accessorKey: "fileLink",
    header: "Photo",
    cell: ({ row }) => (
      <img
        src={row.getValue("fileLink")}
        alt="Item Photo"
        style={{ width: "100px", height: "auto" }}
      />
    ),
  }, */
];

const ItemPage: React.FC = () => {
  const [data, setData] = useState<MsItem[]>([]);

  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMsItem();
    console.log(result);
    setData(result);
  };

  return (
    <div style={{ height: "80vh", overflowY: "auto" }}>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>List Data Item</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <DataTableItem
            data={data}
            columns={columns}
            modalContent={
              <ItemForm
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

export default ItemPage;
