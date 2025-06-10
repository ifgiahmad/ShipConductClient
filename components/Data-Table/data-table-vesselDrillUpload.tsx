"use client";
import React, { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle, Dialog } from "../ui/dialog";

interface HasId {
  id: number;
}

interface DataTableVesselDrillUploadProps<TData extends HasId> {
  data: TData[];
  columns: ColumnDef<TData>[];
  modalContent: React.ReactNode;
  type: string;
  menu: string;
  onSaveData: () => void;
  onClose: () => void;
}

function DataTableVesselDrillUpload<TData extends HasId>({
  data,
  columns,
  modalContent,
  type,
  menu,
  onSaveData,
  onClose,
}: DataTableVesselDrillUploadProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editIdHeader, setEditIdHeader] = useState<number | null>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: { pageIndex: 0, pageSize: 100 },
    },
  });

  const handleOpenModal = (_id: number) => {
    setEditId(_id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    onClose();
  };

  const handleSaveModal = () => {
    setModalOpen(false);
    onSaveData();
  };

  const totalRowCount = data.length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-full">
          {/* Header hanya tampil di layar sm ke atas */}
          <TableHeader className="hidden sm:table-header-group bg-gray-200 sticky top-0 z-10 shadow-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {menu === "CURRENT" ? (
                  <>
                    <TableHead>Actions</TableHead>
                  </>
                ) : (
                  <></>
                )}

                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border sm:border-none block sm:table-row rounded-md sm:rounded-none shadow-sm sm:shadow-none mb-2 sm:mb-0"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {menu === "CURRENT" ? (
                    <>
                      {" "}
                      <TableCell className="block sm:table-cell text-xs sm:text-sm p-3 sm:p-2">
                        <span className="sm:hidden font-bold block mb-1">
                          Actions:
                        </span>
                        <Button
                          className="bg-orange-700 hover:bg-orange-400 text-white h-7 px-3 text-xs sm:text-xs"
                          onClick={() => handleOpenModal(row.original.id)}
                        >
                          {type === "VIDEO"
                            ? "Upload Video"
                            : "Upload Document"}
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <></>
                  )}

                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="block sm:table-cell text-xs sm:text-sm p-3 sm:p-2"
                    >
                      <span className="sm:hidden font-bold block mb-1">
                        {typeof cell.column.columnDef.header === "string"
                          ? cell.column.columnDef.header
                          : ""}
                        :
                      </span>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Row Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-2 sm:gap-0">
        <div className="text-xs sm:text-sm">
          <span>Total rows: {totalRowCount}</span>
          <span className="ml-2 sm:ml-4">
            Filtered rows: {filteredRowCount}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs sm:text-sm">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded-md px-2 py-1 text-xs sm:text-sm"
          >
            <option value={100}>100</option>
            <option value={150}>150</option>
            <option value={200}>200</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="md:max-w-[800px] max-h-[800px] overflow-auto">
          <DialogTitle>Upload Video</DialogTitle>
          {React.cloneElement(modalContent as React.ReactElement, {
            onClose: handleCloseModal,
            onSave: handleSaveModal,
            id: editId,
            idHeader: editIdHeader,
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DataTableVesselDrillUpload;
