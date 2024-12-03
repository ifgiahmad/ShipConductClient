import DataTableColumnHeader from "@/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "@/components/DataTable/DataTableRowActions";
import { MsInterval } from "@/lib/types/MsInterval.types";
import { ColumnDef } from "@tanstack/react-table";

interface IntervalColumnsProps {
  onEdit: (Interval: MsInterval) => void;
  onDelete: (Interval: MsInterval) => void;
}

export const getIntervalColumns = ({
  onEdit,
  onDelete,
}: IntervalColumnsProps): ColumnDef<MsInterval>[] => [
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
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
    size: 50,
  },
];
