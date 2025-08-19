"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Play,
  Square,
  RotateCcw,
  Wand2,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

interface SqlEditorProps {
  onQueryExecute: (results: any) => void;
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  sessionId: string;
  uploadedFiles: any[];
}

export function SqlEditor({
  onQueryExecute,
  isExecuting,
  setIsExecuting,
  sessionId,
  uploadedFiles,
}: SqlEditorProps) {
  const [query, setQuery] = useState(
    "-- Welcome to LiteHouse SQL Editor\n-- Start by uploading a file and writing your SQL query\n\nSELECT * FROM your_table LIMIT 10;"
  );
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [queryStatus, setQueryStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const editorRef = useRef<any>(null);

  const exampleQueries = [
    {
      title: "Select All Records",
      query: "SELECT * FROM table_name LIMIT 100;",
    },
    {
      title: "Count Records",
      query: "SELECT COUNT(*) as total_records FROM table_name;",
    },
    {
      title: "Describe Table",
      query: "DESCRIBE table_name;",
    },
    {
      title: "Group By Example",
      query:
        "SELECT column_name, COUNT(*) as count\nFROM table_name\nGROUP BY column_name\nORDER BY count DESC\nLIMIT 10;",
    },
    {
      title: "Filter Data",
      query:
        "SELECT *\nFROM table_name\nWHERE column_name IS NOT NULL\nORDER BY column_name;",
    },
  ];

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload a file first");
      return;
    }

    setIsExecuting(true);
    setQueryStatus("idle");
    setErrorMessage("");

    const startTime = Date.now();

    try {
      // Simulate API call to backend
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      // Mock successful response
      const mockResults = {
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "VARCHAR" },
          { name: "email", type: "VARCHAR" },
          { name: "created_at", type: "TIMESTAMP" },
        ],
        rows: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          created_at: new Date(
            Date.now() - Math.random() * 10000000000
          ).toISOString(),
        })),
        totalRows: 1250,
        executionTime: Date.now() - startTime,
      };

      setExecutionTime(Date.now() - startTime);
      setQueryStatus("success");
      onQueryExecute(mockResults);
      toast.success("Query executed successfully");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Query execution failed";
      setErrorMessage(errorMsg);
      setQueryStatus("error");
      toast.error(errorMsg);
    } finally {
      setIsExecuting(false);
    }
  };

  const clearEditor = () => {
    setQuery("");
    editorRef.current?.focus();
  };

  const formatQuery = () => {
    // Simple SQL formatting - in a real app, you'd use a proper SQL formatter
    const formatted = query
      .replace(/\bSELECT\b/gi, "SELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bLIMIT\b/gi, "\nLIMIT");

    setQuery(formatted);
    toast.success("Query formatted");
  };

  const insertExampleQuery = (exampleQuery: string) => {
    setQuery(exampleQuery);
    editorRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">SQL Query</CardTitle>
            <div className="flex items-center gap-2">
              {executionTime && (
                <Badge variant="outline" className="text-xs">
                  {executionTime}ms
                </Badge>
              )}
              {queryStatus === "success" && (
                <Badge variant="default" className="text-xs gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Success
                </Badge>
              )}
              {queryStatus === "error" && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Error
                </Badge>
              )}
            </div>
          </div>

          {/* Query Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={executeQuery}
              disabled={isExecuting}
              className="gap-2"
              size="sm"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={clearEditor}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={formatQuery}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Format
            </Button>

            {/* Example Queries Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  Examples
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {exampleQueries.map((example, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => insertExampleQuery(example.query)}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <span className="font-medium text-sm">{example.title}</span>
                    <code className="text-xs text-muted-foreground bg-muted px-1 rounded">
                      {example.query.split("\n")[0]}...
                    </code>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 border-t">
          <div className="h-full">
            <MonacoEditor
              height="100%"
              defaultLanguage="sql"
              value={query}
              onChange={(value) => setQuery(value || "")}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                theme: "vs-light",
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Query Execution Feedback */}
      {isExecuting && (
        <Card className="mt-2">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Executing query...</span>
              <Progress value={undefined} className="flex-1" />
            </div>
          </CardContent>
        </Card>
      )}

      {queryStatus === "error" && errorMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
