import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table"; 
import { columns } from "@/components/ui/data-table-columns"; 
import type { RecordType } from "@/components/ui/data-table-columns";

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: search,
      });
      
      const response = await fetch(`http://localhost:8080/api/records?${params}`); 
      const result = await response.json();

      if (result.success) {
        setRecords(result.data);
        setTotalPages(result.pagination.totalPages); 
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- Top Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Scrapped Places</h1>
        
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>
      {loading ? (
         <div className="text-center py-10 text-gray-500">Loading records...</div>
      ) : (
        <DataTable columns={columns} data={records} />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}