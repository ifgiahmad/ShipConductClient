"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableVesselAssessment from "@/components/Data-Table/data-table-vesselAssessment";
import { TrVesselAssessment } from "@/lib/types/TrVesselAssessment.types";
import {
  generateReportVesselAssessmentById,
  getTrVesselAssessment,
} from "@/services/service_api_vesselAssessment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import TrVesselAssessmentForm from "./vesselAssessmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/services/auth";
import { UserRole } from "@/lib/type";
import DialogViewVesselAssessment from "./DialogViewVesselAssessment";
import DialogEditVesselAssessment from "./DialogEditVesselAssessment";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react"; // Ikon dropdown
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const VesselAssessmentPage: React.FC = () => {
  const [data, setData] = useState<TrVesselAssessment[]>([]);
  const [user, setUser] = useState<UserRole>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const handleSaveHeader = () => {
    fetchData();
  };

  const fetchData = useCallback(async () => {
    const result = await getTrVesselAssessment();
    const filterResult = result.filter(
      (detail) =>
        detail.vslType !== "OB" &&
        detail.vslType !== "DB" &&
        detail.vslType !== "BG"
    );
    setData(filterResult);
  }, []);

  const fetchUser = useCallback(async () => {
    const result = await getUser();
    setUser(result);
  }, []);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [fetchData, fetchUser]);

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

  const handleDownload = async (id: number) => {
    try {
      await generateReportVesselAssessmentById(id); // Ganti dengan ID yang sesuai
      alert("File berhasil diunduh!");
    } catch (error) {
      alert("Gagal mengunduh file.");
    }
  };

  const columns: ColumnDef<TrVesselAssessment>[] = [
    {
      header: "Actions",
      cell: (info: CellContext<TrVesselAssessment, unknown>) => {
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
                <DropdownMenuItem disabled>
                  No Actions Available
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
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await generateReportVesselAssessmentById(row.id);
                        alert("File berhasil diunduh!");
                      } catch (error) {
                        alert("Gagal mengunduh file.");
                      }
                    }}
                  >
                    Export Excel
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
    { header: "Vsl. Mate", accessorKey: "vslMate" },
    { header: "Period", accessorKey: "periodName" },
    { header: "Score Item General", accessorKey: "scoreItemGeneral" },
    { header: "Downtime General", accessorKey: "downtimeGeneral" },
    { header: "Score General", accessorKey: "scoreGeneral" },
    { header: "Status", accessorKey: "status" },
    { header: "Percentage Upload", accessorKey: "percentageUpload" },
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

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">
              List Data Vessel Assessment
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex-grow overflow-auto min-h-[70vh]">
        <Card className="h-full">
          <CardContent className="h-full">
            <div>
              <DataTableVesselAssessment data={data} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog View */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-full max-w-screen-2xl h-[90vh] overflow-auto">
          <DialogTitle>Assessment Detail</DialogTitle>
          <DialogViewVesselAssessment
            onClose={() => setIsViewOpen(false)}
            onSave={fetchData}
            linkCode={selectedLink || ""}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-screen-2xl h-[90vh] overflow-auto">
          <DialogTitle>Edit Assessment</DialogTitle>
          <DialogEditVesselAssessment
            onClose={() => setIsEditOpen(false)}
            onSave={() => {
              fetchData();
              setIsEditOpen(false);
            }}
            id={selectedId || 0}
          />
        </DialogContent>
      </Dialog>

      {
        <Dialog open={isCancelOpen}>
          <DialogContent className="w-full max-w-screen-lg max-h-screen h-auto overflow-auto">
            <DialogTitle>{"Assessment Detail"}</DialogTitle>
            <TrVesselAssessmentForm
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
      }
    </>
  );
};

export default VesselAssessmentPage;
