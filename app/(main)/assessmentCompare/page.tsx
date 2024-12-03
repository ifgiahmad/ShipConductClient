"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MsVessel } from "@/lib/types/Master.types";
import { getMsVessel } from "@/services/service_api_master";
import DataTableAssessmentCompare from "@/components/Data-Table/data-table-assessmentCompare";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: ColumnDef<MsVessel>[] = [
  { header: "Vessel Type", accessorKey: "vslType" },
  { header: "Vessel Code", accessorKey: "vslCode" },
  { header: "Vessel Name", accessorKey: "vslName" },
];

const AssessmentComparePage: React.FC = () => {
  const [data, setData] = useState<MsVessel[]>([]);

  const handleSaveDetail = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getMsVessel();
    setData(result);
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>
              List Data Comparison of last 3 assessments vessel
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div style={{ height: "80vh", overflowY: "auto" }}>
        <Card>
          <CardContent>
            <DataTableAssessmentCompare data={data} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AssessmentComparePage;
