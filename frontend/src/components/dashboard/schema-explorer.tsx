"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Table,
  FileText,
  Database,
  ChevronDown,
  ChevronRight,
  Upload,
  File,
  X,
} from "lucide-react";

interface SchemaExplorerProps {
  uploadedFiles: any[];
  sessionId: string;
  onFilesUploaded: (files: any[]) => void;
}

interface TableSchema {
  name: string;
  type: string;
  rowCount: number;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
  }>;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  rowCount?: number;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  columns?: Array<{
    name: string;
    type: string;
    nullable: boolean;
  }>;
}

export function SchemaExplorer({
  uploadedFiles,
  sessionId,
  onFilesUploaded,
}: SchemaExplorerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [uploadQueue, setUploadQueue] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Mock table schemas - in real app, this would come from API
  const tableSchemas: TableSchema[] = uploadedFiles.map((file, index) => ({
    name: file.name?.replace(/\.[^/.]+$/, "") || `table_${index}`,
    type: file.type || "csv",
    rowCount: file.rowCount || 0,
    columns: file.columns || [],
  }));

  const toggleTableExpansion = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "csv":
        return <FileText className="h-4 w-4" />;
      case "sqlite":
        return <Database className="h-4 w-4" />;
      case "parquet":
      case "json":
        return <Table className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: `${file.name}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: getFileType(file.name),
        uploadedAt: new Date(),
        status: "uploading" as const,
        progress: 0,
      }));

      setUploadQueue((prev) => [...prev, ...newFiles]);

      // Simulate file upload and processing
      for (const file of newFiles) {
        await simulateFileUpload(file);
      }
    },
    []
  );

  const simulateFileUpload = async (file: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadQueue((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
      );
    }

    // Simulate processing
    setUploadQueue((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, status: "processing" } : f))
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Complete upload
    const mockRowCount = Math.floor(Math.random() * 10000) + 100;
    const completedFile = {
      ...file,
      status: "completed" as const,
      rowCount: mockRowCount,
      columns: generateMockColumns(file.type),
    };

    setUploadQueue((prev) =>
      prev.map((f) => (f.id === file.id ? completedFile : f))
    );

    // Update parent component with all completed files
    const allCompletedFiles = [...uploadedFiles, completedFile];
    onFilesUploaded(allCompletedFiles);

    toast.success(`${file.name} uploaded successfully`);
  };

  const generateMockColumns = (fileType: string) => {
    const commonColumns = [
      { name: "id", type: "INTEGER", nullable: false },
      { name: "name", type: "VARCHAR", nullable: true },
      { name: "created_at", type: "TIMESTAMP", nullable: false },
    ];
    return commonColumns;
  };

  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "csv":
        return "csv";
      case "json":
        return "json";
      case "sqlite":
      case "db":
        return "sqlite";
      case "parquet":
        return "parquet";
      default:
        return "unknown";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "csv":
        return <FileText className="h-4 w-4" />;
      case "sqlite":
        return <Database className="h-4 w-4" />;
      case "json":
      case "parquet":
        return <Table className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadQueue((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/x-sqlite3": [".sqlite", ".db"],
      "application/octet-stream": [".parquet"],
    },
    multiple: true,
  });

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <h3 className="font-semibold">Tables</h3>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {tableSchemas.length === 0 ? (
          <div className="space-y-4">
            {/* Drag and Drop Area */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload
                    className={`h-8 w-8 mx-auto mb-3 ${
                      isDragActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {isDragActive
                        ? "Drop files to upload"
                        : "Drag & drop your data files here"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports CSV, Parquet, JSON, SQLite
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploadQueue.length > 0 && (
              <Card>
                <CardContent className="p-3 space-y-2">
                  {uploadQueue.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 p-2 rounded border text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <span className="font-medium truncate">
                          {file.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.status === "uploading" && (
                          <div className="w-12">
                            <Progress value={file.progress} className="h-1" />
                          </div>
                        )}

                        {file.status === "processing" && (
                          <Badge variant="outline" className="text-xs">
                            Processing...
                          </Badge>
                        )}

                        {file.status === "completed" && file.rowCount && (
                          <Badge variant="default" className="text-xs">
                            {file.rowCount.toLocaleString()} rows
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUploadedFile(file.id)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {tableSchemas.map((table) => (
              <Card key={table.name} className="overflow-hidden">
                <div className="p-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto"
                    onClick={() => toggleTableExpansion(table.name)}
                  >
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(table.type)}
                      <span className="font-medium text-sm">{table.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {table.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {table.rowCount.toLocaleString()} rows
                      </Badge>
                      {expandedTables.has(table.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </Button>

                  {expandedTables.has(table.name) &&
                    table.columns.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {table.columns.map((column, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/50"
                          >
                            <span className="font-medium">{column.name}</span>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0"
                              >
                                {column.type}
                              </Badge>
                              {column.nullable && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-1 py-0"
                                >
                                  NULL
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
