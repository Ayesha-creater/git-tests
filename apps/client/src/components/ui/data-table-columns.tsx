import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type RecordType = {
  id: number
  name: string
  address: string | null
  rating: string | null
  phone: string | null
  link: string
}

export const columns: ColumnDef<RecordType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("address") || "N/A"}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <div>{row.getValue("rating") || "N/A"}</div>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const record = row.original
      return (
        <a 
          href={record.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline text-sm"
        >
          View Map
        </a>
      )
    },
  },
]