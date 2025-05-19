"use client";
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";

interface HasId {
  id: number;
  normalFileLink?: string;
  docLink?: string;
}

interface DataTableDrillDetailProps<TData extends HasId> {
  data: TData[];
  columns: ColumnDef<TData>[];
  modalContent: React.ReactNode;
  idHeader: number;
  vslType: string;
  onSaveData: () => void;
  status: string;
  mode: string;
}

function DataTableDrillDetail<TData extends HasId>({
  data,
  columns,
  modalContent,
  idHeader,
  onSaveData,
  vslType,
  status,
  mode,
}: DataTableDrillDetailProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editIdHeader, setEditIdHeader] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editVslType, setEditVslType] = useState<string | null>(null);

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
    },
  });

  useEffect(() => {
    setEditIdHeader(idHeader);
    setEditVslType(vslType);
  }, [idHeader, vslType]);

  const handleOpenModal = (_id: number, _mode: string) => {
    setEditId(_id);
    setEditMode(_mode);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleSaveModal = () => {
    setModalOpen(false);
    onSaveData();
  };

  const totalRowCount = data.length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter items..."
          value={
            (table.getColumn("itemName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("item")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/*  <Button
          className="ml-2 bg-green-900 hover:bg-green-600"
          onClick={() => handleOpenModal(0, "CREATE")}
        >
          Add Data
        </Button> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Show Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">...</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {row.original.normalFileLink || row.original.docLink ? (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenModal(row.original.id, "INPUT GRADE")
                              }
                            >
                              Input Grade
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenModal(row.original.id, "EDIT")
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenModal(row.original.id, "DELETE")
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleOpenModal(row.original.id, "UPLOAD VIDEO")
                              }
                            >
                              Upload File
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
      <div className="flex items-center justify-between py-4">
        <div>
          <span>Total rows: {totalRowCount}</span>
          <span className="ml-4">Filtered rows: {filteredRowCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="mr-2">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded-md px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="lg:max-w-[1000px] max-h-[700px] overflow-auto">
          <DialogTitle>{"Drill Detail"}</DialogTitle>
          {React.cloneElement(modalContent as React.ReactElement, {
            onClose: handleCloseModal,
            onSave: handleSaveModal,
            id: editId,
            idHeader: editIdHeader,
            vslType: editVslType,
            mode: editMode,
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DataTableDrillDetail;
