import DataTableColumnHeader from "@/components/DataTable/DataTableColumnHeader";
import DataTableRowActions from "@/components/DataTable/DataTableRowActions";
import { MsShipSection } from "@/lib/types/MsShipSection.types";
import { ColumnDef } from "@tanstack/react-table";

interface ShipSectionColumnsProps {
  onEdit: (ShipSection: MsShipSection) => void;
  onDelete: (ShipSection: MsShipSection) => void;
}

export const getShipSectionColumns = ({
  onEdit,
  onDelete,
}: ShipSectionColumnsProps): ColumnDef<MsShipSection>[] => [
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
    accessorKey: "sectionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sectionName" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sectionName")}</div>
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
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
    size: 50,
  },
];
