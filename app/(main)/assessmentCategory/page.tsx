"use client";
import React, { useEffect, useState, useCallback } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import DataTableAssessmentCategory from "@/components/Data-Table/data-table-assessmentCategory";
import { MsAssessmentCategory } from "@/lib/type";
import { getMsAssessmentCategory } from "@/services/service_api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AssessmentCategoryForm from "./assessmentCategoryForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/services/auth";
import { UserRole } from "@/lib/type";
import DialogEditAssessmentCategory from "./DialogEditAssessmentCategory";
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

const AssessmentCategoryPage: React.FC = () => {
  const [data, setData] = useState<MsAssessmentCategory[]>([]);
  const [user, setUser] = useState<UserRole>();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const handleSaveHeader = () => {
    fetchData();
  };

  const fetchData = useCallback(async () => {
    const result = await getMsAssessmentCategory();
    setData(result);
  }, []);

  const fetchUser = useCallback(async () => {
    const result = await getUser();
    setUser(result);
  }, []);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, [fetchData, fetchUser]);

  const handleOpenModal = (mode: string, id: number) => {
    setSelectedId(id);
    setMode(mode);
    /*  if (mode === "Edit") {
      setMode("Edit");
    }
    if (mode == "Delete") {
      setMode("Delete");
    }
    if (mode == "Add") {
      setMode("Add");
    } */
    setIsEditOpen(true);
  };

  const columns: ColumnDef<MsAssessmentCategory>[] = [
    {
      id: "actions", // WAJIB ditambahkan untuk kolom non-data
      header: () => (
        <Button
          className="ml-2 bg-green-900 hover:bg-green-600"
          onClick={() => handleOpenModal("Add", 0)}
          size="sm"
        >
          Add Data
        </Button>
      ),
      cell: (info: CellContext<MsAssessmentCategory, unknown>) => {
        const row = info.row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <>
                <DropdownMenuItem
                  onClick={() => handleOpenModal("EDIT", row.id)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleOpenModal("DELETE", row.id)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    { header: "Vessel Type", accessorKey: "vslType" },
    { header: "Item", accessorKey: "item" },
    { header: "Interval", accessorKey: "interval" },
    { header: "Category Section", accessorKey: "categorySection" },
    { header: "Ship Section", accessorKey: "shipSection" },
    { header: "Role Category", accessorKey: "roleCategory" },
    { header: "Start Month", accessorKey: "startMonthString" },
  ];

  return (
    <>
      <div>
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>List Data Assessment Category</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex-grow overflow-auto min-h-[70vh]">
        <Card className="h-full">
          <CardContent className="h-full">
            <div>
              <DataTableAssessmentCategory data={data} columns={columns} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-screen-lg h-[90vh] overflow-auto">
          <DialogTitle>{mode} Assesment Category</DialogTitle>
          <DialogEditAssessmentCategory
            onClose={() => setIsEditOpen(false)}
            onSave={() => {
              fetchData();
              setIsEditOpen(false);
            }}
            id={selectedId || 0}
            mode={mode || ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentCategoryPage;
