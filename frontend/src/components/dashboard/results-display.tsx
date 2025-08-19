"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Download,
  RefreshCw,
  RotateCcw,
  ArrowUpDown,
  Database,
  FileText,
} from "lucide-react";

interface ResultsDisplayProps {
  results: any;
  isExecuting: boolean;
}

interface Column {
  name: string;
  type: string;
}

export function ResultsDisplay({ results, isExecuting }: ResultsDisplayProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [jumpToPage, setJumpToPage] = useState("");

  if (isExecuting) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Query Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Query Results</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Database className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">No results to display</p>
              <p className="text-xs text-muted-foreground mt-1">
                Execute a SQL query to see results here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { columns, rows, totalRows, executionTime } = results;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startRow = (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
    // In a real app, this would trigger a new query with sorting
    toast.success(
      `Sorted by ${columnName} ${
        sortDirection === "asc" ? "descending" : "ascending"
      }`
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, this would fetch new data
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(1);
    // In a real app, this would fetch new data
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpToPage("");
    } else {
      toast.error("Invalid page number");
    }
  };

  const exportToCsv = () => {
    // Mock CSV export
    const csvContent = [
      columns.map((col: Column) => col.name).join(","),
      ...rows.map((row: any) =>
        columns
          .map((col: Column) =>
            typeof row[col.name] === "string"
              ? `"${row[col.name]}"`
              : row[col.name]
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query_results_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Results exported to CSV");
  };

  const refreshResults = () => {
    // In a real app, this would re-execute the query
    toast.success("Results refreshed");
  };

  const clearResults = () => {
    // This would clear the results in the parent component
    toast.success("Results cleared");
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return (
        <Badge variant="secondary" className="text-xs">
          NULL
        </Badge>
      );
    }
    if (typeof value === "string" && value.length > 100) {
      return (
        <span title={value} className="truncate block max-w-xs">
          {value.substring(0, 100)}...
        </span>
      );
    }
    return String(value);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Query Results</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {rows.length} rows
            </Badge>
            <Badge variant="outline" className="text-xs">
              {columns.length} columns
            </Badge>
            {executionTime && (
              <Badge variant="outline" className="text-xs">
                {executionTime}ms
              </Badge>
            )}
          </div>
        </div>

        {/* Results Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshResults}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearResults}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 border-t">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column: Column) => (
                  <TableHead
                    key={column.name}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort(column.name)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{column.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {column.type}
                      </Badge>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row: any, index: number) => (
                <TableRow key={index}>
                  {columns.map((column: Column) => (
                    <TableCell key={column.name} className="font-mono text-xs">
                      {formatCellValue(row[column.name])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      {/* Pagination Footer */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {startRow}-{endRow} of {totalRows.toLocaleString()} rows
            </p>

            <div className="flex items-center gap-2">
              <label className="text-sm">Rows per page:</label>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Jump to page:</label>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJumpToPage()}
                className="w-16 h-8"
                placeholder="1"
              />
              <Button size="sm" variant="outline" onClick={handleJumpToPage}>
                Go
              </Button>
            </div>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum === currentPage}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
}
