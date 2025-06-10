"use client";
import React, { useEffect, useState } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableVesselDrill from "@/components/Data-Table/data-table-vesselDrill";
import { TrVesselDrill } from "@/lib/types/TrVesselDrill.types";
import { getTrVesselDrill } from "@/services/service_api_vesselDrill";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { format } from "date-fns";
import TrVesselDrillForm from "./vesselDrillForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateReportVesselAssessmentById } from "@/services/service_api_vesselAssessment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import DataTableVesselDrillUpload from "@/components/Data-Table/data-table-vesselDrillUpload";
import DialogEditVesselDrill from "./DialogEditVesselDrill";
import DialogViewVesselDrill from "./DialogViewVesselDrill";

/* const columns: ColumnDef<TrVesselDrill>[] = [
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
]; */

const VesselDrillPage: React.FC = () => {
  const [data, setData] = useState<TrVesselDrill[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
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

  const handleOpenModal = (
    mode: "view" | "edit" | "cancel",
    id: number,
    linkCode: string
  ) => {
    setSelectedId(id);
    setSelectedLink(linkCode);

    if (mode === "view") setIsViewOpen(true);
    if (mode === "edit") setIsEditOpen(true);
    if (mode === "cancel") setIsCancelOpen(true);
  };

  const columns: ColumnDef<TrVesselDrill>[] = [
    {
      header: "Actions",
      cell: (info: CellContext<TrVesselDrill, unknown>) => {
        const row = info.row.original;
        const isDisabled = row.status === "CANCEL" || row.status === "CLOSED";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isDisabled ? (
                <DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenModal("view", row.id, row.linkCode || "")
                    }
                  >
                    View
                  </DropdownMenuItem>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenModal("view", row.id, row.linkCode || "")
                    }
                  >
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenModal("edit", row.id, row.linkCode || "")
                    }
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleOpenModal("cancel", row.id, row.linkCode || "")
                    }
                    className="text-red-600"
                  >
                    Cancel
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    { header: "Vsl. Type", accessorKey: "vslType" },
    { header: "Vsl. Name", accessorKey: "vslName" },
    { header: "Period", accessorKey: "periodName" },
    { header: "Status", accessorKey: "status" },
    { header: "Percent Upload", accessorKey: "percentageUpload" },
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

  const handleDownload = async (id: number) => {
    try {
      await generateReportVesselAssessmentById(id); // Ganti dengan ID yang sesuai
      alert("File berhasil diunduh!");
    } catch (error) {
      alert("Gagal mengunduh file.");
    }
  };

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">List Data Vessel Drill</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex-grow overflow-auto min-h-[70vh]">
        <Card className="h-full">
          <CardContent className="h-full">
            <div>
              <DataTableVesselDrill data={data} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Dialog View */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-full max-w-screen-2xl h-[90vh] overflow-auto">
          <DialogTitle>Drill Detail</DialogTitle>
          <DialogViewVesselDrill
            onClose={() => {
              setIsEditOpen(false);
              setIsViewOpen(false);
            }}
            onSave={() => {
              fetchData();
              setIsEditOpen(false);
            }}
            id={selectedId || 0}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-screen-2xl h-[90vh] overflow-auto">
          <DialogTitle>Edit Drill</DialogTitle>
          <DialogEditVesselDrill
            onClose={() => setIsEditOpen(false)}
            onSave={() => {
              fetchData();
              setIsEditOpen(false);
            }}
            id={selectedId || 0}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog Cancel */}
      <Dialog open={isCancelOpen}>
        <DialogContent className="w-full max-w-screen-lg max-h-screen h-auto overflow-auto">
          <DialogTitle>{"Drill Detail"}</DialogTitle>
          <TrVesselDrillForm
            onClose={() => setIsCancelOpen(false)}
            onSave={() => {
              fetchData();
              setIsCancelOpen(false);
            }}
            id={selectedId || 0}
            mode="cancel"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VesselDrillPage;
