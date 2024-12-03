import DataTableColumnHeader from "@/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "@/components/DataTable/DataTableRowActions";
import { MsDrillCategory } from "@/lib/types/MsDrillCategory.types";
import { ColumnDef } from "@tanstack/react-table";

interface DrillCategoryColumnsProps {
  onEdit: (DrillCategory: MsDrillCategory) => void;
  onDelete: (DrillCategory: MsDrillCategory) => void;
}

export const getDrillCategoryColumns = ({
  onEdit,
  onDelete,
}: DrillCategoryColumnsProps): ColumnDef<MsDrillCategory>[] => [
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
