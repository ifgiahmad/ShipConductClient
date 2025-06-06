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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import DialogDownloadVesselAssessment from "@/app/(main)/vesselAssessment/DialogDownloadAssessment";

interface HasId {
  id: number;
  status?: string;
  linkCode?: string;
}

interface DataTableProps<TData extends HasId> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

function DataTableVesselAssessment<TData extends HasId>({
  data,
  columns,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const handleOpenDownloadDialog = () => {
    setIsDownloadOpen(true);
  };

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
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return String(row.getValue(columnId))
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  });

  const urlAdd = "/vesselAssessment/add";

  const totalRowCount = data.length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <>
      <div className="flex items-center py-2 gap-2 text-xs">
        <Link href={urlAdd}>
          <Button
            className="bg-green-900 hover:bg-green-600 h-7 px-3 text-xs"
            variant={"default"}
          >
            Add Data
          </Button>
        </Link>
        <Button
          className="bg-yellow-600 hover:bg-yellow-300 h-7 px-3 text-xs"
          onClick={() => handleOpenDownloadDialog()}
        >
          Download
        </Button>
      </div>

      <div className="rounded border overflow-auto text-xs max-h-[80vh] mt-2">
        <Table className="text-xs [&_td]:p-1 [&_th]:p-1">
          <TableHeader className="bg-gray-200 sticky top-0 z-10 shadow-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-6">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <div className="flex flex-col items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                      {header.column.getCanFilter() ? (
                        <Input
                          type="text"
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder={`Search `}
                          className="mt-1 w-full text-xs px-2 py-0.5 h-6 border rounded text-center"
                        />
                      ) : null}
                    </div>
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
                  className="h-6"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1">
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

      <div className="flex items-center justify-between py-4 text-xs">
        <div>
          <span>Total rows: {totalRowCount}</span>
          <span className="ml-4">Filtered rows: {filteredRowCount}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label className="mr-2">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-xs"
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

      {/* Dialog Edit */}
      <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
        <DialogContent className="w-full max-w-lg h-auto overflow-auto">
          <DialogTitle>Download Document</DialogTitle>
          <DialogDownloadVesselAssessment
            onClose={() => setIsDownloadOpen(false)}
            onSave={() => {
              setIsDownloadOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DataTableVesselAssessment;
