"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableVesselDrill from "@/components/Data-Table/_data-table-vesselDrill";
import { TrVesselDrill } from "@/lib/types/TrVesselDrill.types";
import { getTrVesselDrill } from "@/services/service_api_vesselDrill";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { format } from "date-fns";
import TrVesselDrillForm from "./_vesselDrillForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<TrVesselDrill>[] = [
  { header: "Vessel Type", accessorKey: "vslType" },
  { header: "Vessel Name", accessorKey: "vslName" },
  {
    header: "Period Date",
    accessorFn: (row) => {
      const dateValue = row.periodDate ? new Date(row.periodDate) : null;
      return dateValue ? format(dateValue, "dd-MM-yyyy") : "N/A";
    },
  },
  {
    header: "Final Date",
    accessorFn: (row) => {
      const dateValue = row.finalDate ? new Date(row.finalDate) : null;
      return dateValue ? format(dateValue, "dd-MM-yyyy") : "N/A";
    },
  },
  { header: "Grade", accessorKey: "grade" },
  { header: "Status", accessorKey: "status" },
  {
    accessorKey: "linkShared",
    header: "Link Share",
    cell: (info: CellContext<TrVesselDrill, unknown>) => {
      const [copied, setCopied] = React.useState(false);
      const url = info.getValue() as string;

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
          {url && (
            <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
              <button
                className="bg-green-900  font-small text-white hover:bg-green-700 ml-3 w-auto text-sm"
                style={{ marginLeft: "8px" }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </CopyToClipboard>
          )}
        </div>
      );
    },
  },
];

const VesselDrillPage: React.FC = () => {
  const [data, setData] = useState<TrVesselDrill[]>([]);
  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getTrVesselDrill();
    setData(result);
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>List Data Vessel Drill</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div style={{ height: "70vh", overflowY: "auto" }}>
        <Card>
          <CardContent>
            <div>
              <DataTableVesselDrill
                data={data}
                columns={columns}
                modalContent={
                  <TrVesselDrillForm
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
                mode={""}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VesselDrillPage;
