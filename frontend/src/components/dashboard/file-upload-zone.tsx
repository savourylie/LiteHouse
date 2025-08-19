"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Upload,
  File,
  X,
  FileText,
  Database,
  Table,
  Clock,
  HardDrive,
} from "lucide-react";

interface FileUploadZoneProps {
  onFilesUploaded: (files: any[]) => void;
  sessionId: string;
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
}

export function FileUploadZone({
  onFilesUploaded,
  sessionId,
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

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

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simulate file upload and processing
      for (const file of newFiles) {
        await simulateFileUpload(file);
      }

      // Update parent component
      const completedFiles = uploadedFiles.filter(
        (f) => f.status === "completed"
      );
      onFilesUploaded(completedFiles);
    },
    [uploadedFiles, onFilesUploaded]
  );

  const simulateFileUpload = async (file: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, progress } : f))
      );
    }

    // Simulate processing
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, status: "processing" } : f))
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Complete upload
    const mockRowCount = Math.floor(Math.random() * 10000) + 100;
    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === file.id
          ? {
              ...f,
              status: "completed",
              rowCount: mockRowCount,
              // Mock column schema
              columns: generateMockColumns(file.type),
            }
          : f
      )
    );

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

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    const remainingFiles = uploadedFiles.filter(
      (f) => f.id !== fileId && f.status === "completed"
    );
    onFilesUploaded(remainingFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const totalFiles = uploadedFiles.length;
  const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Drag and Drop Area */}
      <Card className="flex-1">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload
              className={`h-12 w-12 mx-auto mb-4 ${
                isDragActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop files to upload"
                  : "Drag & drop your data files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports CSV, Parquet, JSON, SQLite
              </p>
              <Button variant="outline" className="mt-4">
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Uploaded Files</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {totalFiles} files
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(totalSize)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-2 rounded border"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <span className="text-sm font-medium truncate">
                    {file.name}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {file.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>

                  {file.status === "uploading" && (
                    <div className="w-16">
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
                    onClick={() => removeFile(file.id)}
                    className="h-6 w-6 p-0"
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
  );
}
