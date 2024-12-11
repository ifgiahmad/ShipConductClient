import DataTableColumnHeader from "@/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "@/components/DataTable/DataTableRowActions";
import { MsItem } from "@/lib/types/MsItem.types";
import { ColumnDef } from "@tanstack/react-table";

interface ItemColumnsProps {
  onEdit: (Item: MsItem) => void;
  onDelete: (Item: MsItem) => void;
}

export const getItemColumns = ({
  onEdit,
  onDelete,
}: ItemColumnsProps): ColumnDef<MsItem>[] => [
  {
    accessorKey: "itemName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item Name" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("itemName")}</div>
    ),
  },
  {
    accessorKey: "fileLink",
    header: "Photo",
    cell: ({ row }) => (
      <img
        src={row.getValue("fileLink")}
        alt=""
        style={{ width: "100px", height: "auto" }}
      />
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
