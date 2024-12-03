import DataTableColumnHeader from "@/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "@/components/DataTable/DataTableRowActions";
import { MsAssessmentCategory } from "@/lib/type";
import { ColumnDef } from "@tanstack/react-table";

interface AssessmentCategoryColumnsProps {
  onEdit: (assessmentCategory: MsAssessmentCategory) => void;
  onDelete: (assessmentCategory: MsAssessmentCategory) => void;
}

export const getAssessmentCategoryColumns = ({
  onEdit,
  onDelete,
}: AssessmentCategoryColumnsProps): ColumnDef<MsAssessmentCategory>[] => [
  {
    accessorKey: "vslType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="vslType" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("vslType")}</div>
    ),
  },
  {
    accessorKey: "item",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="item" />
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("item")}</div>,
  },
  {
    accessorKey: "interval",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="interval" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("interval")}</div>
    ),
  },
  {
    accessorKey: "categorySection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="categorySection" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("categorySection")}</div>
    ),
  },
  {
    accessorKey: "shipSection",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="shipSection" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("shipSection")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
    size: 50,
  },
];
