"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableVesselAssessment from "@/components/Data-Table/data-table-vesselAssessment";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import { getTrVesselAssessment } from "@/services/service_api_vesselAssessment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { format } from "date-fns";
import TrVesselAssessmentForm from "./vesselAssessmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/services/auth";
import { UserLogin, UserRole } from "@/lib/type";

const columns: ColumnDef<TrVesselAssessment>[] = [
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
  { header: "Score General", accessorKey: "scoreGeneral" },
  { header: "Score Technical", accessorKey: "scoreTechnical" },
  { header: "Score Marine", accessorKey: "scoreMarine" },
  { header: "Total Score", accessorKey: "totalScore" },
  { header: "Status", accessorKey: "status" },
  {
    accessorKey: "linkShared",
    header: "Link Share",
    cell: (info: CellContext<TrVesselAssessment, unknown>) => {
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

const VesselAssessmentPage: React.FC = () => {
  const [data, setData] = useState<TrVesselAssessment[]>([]);
  const [user, setUser] = useState<UserRole>();
  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  const fetchData = async () => {
    const result = await getTrVesselAssessment();
    setData(result);
  };

  const fetchUser = async () => {
    const result = await getUser();
    setUser(result);
    console.log(result);
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>List Data Vessel Assessment</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div style={{ height: "70vh", overflowY: "auto" }}>
        <Card>
          <CardContent>
            <div>
              <DataTableVesselAssessment
                data={data}
                columns={columns}
                modalContent={
                  <TrVesselAssessmentForm
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

export default VesselAssessmentPage;
