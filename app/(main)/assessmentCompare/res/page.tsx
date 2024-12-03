"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  VwAssessmentDetailCompare,
  AssessmentDetailCompareGroupByItem,
} from "@/lib/types/VwAssessmentDetailCompare";
import { getAssessmentDetailCompareByVslCode } from "@/services/service_api_assessmentDetailCompare";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssessmentDetailComparePage: React.FC = () => {
  const router = useRouter();
  const { vslCode, vslName } = useParams();
  const [data, setData] = useState<VwAssessmentDetailCompare[]>([]);
  const [dataGrouping, setDataGrouping] = useState<
    AssessmentDetailCompareGroupByItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] =
    useState<VwAssessmentDetailCompare | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const handleOpenModal = (detail: VwAssessmentDetailCompare) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDetail(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof vslCode === "string") {
          const fetchedData = await getAssessmentDetailCompareByVslCode(
            vslCode
          );
          setData(fetchedData);

          if (fetchedData) {
            const grouped = fetchedData.reduce(
              (acc: AssessmentDetailCompareGroupByItem[], detail) => {
                const group = acc.find((g) => g.item === detail.item);
                if (group) {
                  group.details.push(detail);
                } else {
                  acc.push({ item: detail.item, details: [detail] });
                }
                return acc;
              },
              []
            );
            setDataGrouping(grouped);
            console.log("Grouped data:", grouped); // Log grouped data here
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vslCode]);

  const columns: ColumnDef<AssessmentDetailCompareGroupByItem>[] = [
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => (
        <span>
          {row.getCanExpand() ? (
            <Button onClick={row.getToggleExpandedHandler()}>
              {row.getIsExpanded() ? "▼" : "▶"}
            </Button>
          ) : null}
          {row.original.item}
        </span>
      ),
    },
    {
      accessorKey: "details",
      header: "Gambar 1",
      cell: ({ row }) => {
        const detail = row.original.details[0];
        const smallFileLink = detail?.smallFileLink;

        return (
          <div>
            {smallFileLink ? (
              <div>
                <img
                  src={smallFileLink}
                  alt={`Gambar 1 for ${row.original.item}`}
                  style={{ width: "100px", height: "auto" }}
                />
                <Button
                  onClick={() => handleOpenModal(row.original.details[0])}
                  className="mt-2"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "details",
      header: "Gambar 2",
      cell: ({ row }) => {
        const detail = row.original.details[1];
        const smallFileLink = detail?.smallFileLink;

        return (
          <div>
            {smallFileLink ? (
              <div>
                <img
                  src={smallFileLink}
                  alt={`Gambar 2 for ${row.original.item}`}
                  style={{ width: "100px", height: "auto" }}
                />
                <Button
                  onClick={() => handleOpenModal(row.original.details[1])}
                  className="mt-2"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "details",
      header: "Gambar 3",
      cell: ({ row }) => {
        const detail = row.original.details[2];
        const smallFileLink = detail?.smallFileLink;

        return (
          <div>
            {smallFileLink ? (
              <div>
                <img
                  src={smallFileLink}
                  alt={`Gambar 3 for ${row.original.item}`}
                  style={{ width: "100px", height: "auto" }}
                />
                <Button
                  onClick={() => handleOpenModal(row.original.details[2])}
                  className="mt-2"
                >
                  View Details
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dataGrouping,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const totalRowCount = data.length;
  const filteredRowCount = table.getRowModel().rows.length;

  return (
    <>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>
            Comparison of last 3 assessments vessel {vslName}
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Item..."
              value={
                (table.getColumn("item")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("item")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />

            <DropdownMenu>
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={columns.length}>
                          <ul>
                            {row.original.details.map((detail, index) => (
                              <li key={index}>{detail.smallFileLink}</li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
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
        </CardContent>
      </Card>
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter Item..."
          value={(table.getColumn("item")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("item")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
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
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <ul>
                        {row.original.details.map((detail, index) => (
                          <li key={index}>{detail.smallFileLink}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
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
      </div> */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="md:max-w-[800px] max-h-[600px] overflow-auto">
          <DialogTitle>Detail</DialogTitle>
          {selectedDetail && (
            <div>
              <p>
                <strong>Item:</strong> {selectedDetail.item}
                <strong>Period Date:</strong>{" "}
                {selectedDetail.periodDate
                  ? new Date(selectedDetail.periodDate).toLocaleDateString()
                  : null}
                {/* row.periodDate ? new Date(row.periodDate) : null; */}
              </p>
              <img
                src={selectedDetail.normalFileLink}
                alt="Detail Image"
                style={{ width: "100%", height: "auto" }}
              />
              {/* Add more details as needed */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentDetailComparePage;
