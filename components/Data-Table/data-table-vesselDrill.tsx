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
}

interface DataTableProps<TData extends HasId> {
  data: TData[];
  columns: ColumnDef<TData>[];
}

function DataTableVesselDrill<TData extends HasId>({
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

  const urlAdd = "/vesselDrill/add";

  const totalRowCount = data.length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center py-2 gap-2 text-xs">
        <Link href="/vesselDrill/add">
          <Button className="bg-green-900 hover:bg-green-600 h-7 px-3 text-xs">
            Add Data
          </Button>
        </Link>
        <Button
          className="bg-yellow-600 hover:bg-yellow-300 h-7 px-3 text-xs"
          onClick={() => setIsDownloadOpen(true)}
        >
          Download
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-md border overflow-auto max-h-[80vh] text-xs">
        <Table>
          <TableHeader className="bg-gray-200 sticky top-0 z-10 shadow-md">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="px-2 py-1">
                    <div className="flex flex-col items-center">
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {header.column.getCanFilter() && (
                        <Input
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder={`Search`}
                          className="mt-1 w-full text-xs px-2 py-0.5 h-6 border rounded text-center"
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-2 py-1">
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
                  className="h-20 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Info */}
      <div className="flex justify-between items-center py-2 text-xs">
        <div>
          <span>Total: {data.length}</span>
          <span className="ml-3">
            Filtered: {table.getRowModel().rows.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="whitespace-nowrap">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded px-1 py-0.5 text-xs h-6"
          >
            {[10, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={table.previousPage}
            disabled={!table.getCanPreviousPage()}
            className="h-6 px-2 text-xs"
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={table.nextPage}
            disabled={!table.getCanNextPage()}
            className="h-6 px-2 text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
        <DialogContent className="w-full max-w-lg overflow-auto">
          <DialogTitle className="text-sm">Download Document</DialogTitle>
          <DialogDownloadVesselAssessment
            onClose={() => setIsDownloadOpen(false)}
            onSave={() => setIsDownloadOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DataTableVesselDrill;
