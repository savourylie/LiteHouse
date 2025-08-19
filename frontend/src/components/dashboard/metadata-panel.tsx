"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  FileText,
  Database,
  Table,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  HardDrive,
  Clock,
  Hash,
  Type,
  Eye,
  ChevronUp,
} from "lucide-react";

interface MetadataPanelProps {
  uploadedFiles: any[];
}

interface FileMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  memoryUsage: number;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    sampleValues?: string[];
  }>;
}

export function MetadataPanel({ uploadedFiles }: MetadataPanelProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(
    uploadedFiles.length > 0 ? uploadedFiles[0].id : null
  );
  const [isMinimized, setIsMinimized] = useState(false);
  const [mockData, setMockData] = useState<Record<string, any>>({});

  // Generate consistent mock data on client side only
  useEffect(() => {
    const newMockData: Record<string, any> = {};
    uploadedFiles.forEach((file) => {
      if (!mockData[file.id]) {
        // Use file name as seed for consistent random values
        const seed = file.name
          .split("")
          .reduce((a, b) => a + b.charCodeAt(0), 0);
        newMockData[file.id] = {
          rowCount: (seed % 9900) + 100,
          columnCount: (seed % 12) + 3,
          memoryUsage: (seed % 60) + 20,
        };
      } else {
        newMockData[file.id] = mockData[file.id];
      }
    });
    setMockData(newMockData);
  }, [uploadedFiles]);

  // Mock metadata - in real app, this would come from API
  const fileMetadata: FileMetadata[] = uploadedFiles.map((file, index) => ({
    id: file.id,
    name: file.name,
    type: file.type,
    size: file.size,
    uploadedAt: file.uploadedAt,
    rowCount: file.rowCount || mockData[file.id]?.rowCount || 100,
    columnCount: mockData[file.id]?.columnCount || 5,
    memoryUsage: mockData[file.id]?.memoryUsage || 50,
    columns: [
      {
        name: "id",
        type: "INTEGER",
        nullable: false,
        sampleValues: ["1", "2", "3", "4", "5"],
      },
      {
        name: "name",
        type: "VARCHAR(255)",
        nullable: true,
        sampleValues: [
          "John Doe",
          "Jane Smith",
          "Bob Johnson",
          null,
          "Alice Brown",
        ],
      },
      {
        name: "email",
        type: "VARCHAR(255)",
        nullable: false,
        sampleValues: [
          "john@example.com",
          "jane@example.com",
          "bob@example.com",
        ],
      },
      {
        name: "created_at",
        type: "TIMESTAMP",
        nullable: false,
        sampleValues: [
          "2024-01-15 10:30:00",
          "2024-01-16 14:22:00",
          "2024-01-17 09:15:00",
        ],
      },
      {
        name: "score",
        type: "DECIMAL(10,2)",
        nullable: true,
        sampleValues: ["85.5", "92.3", "78.9", null, "96.1"],
      },
    ],
  }));

  const selectedFile = fileMetadata.find((f) => f.id === selectedFileId);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date) => {
    // Use a consistent format to avoid hydration issues with locale differences
    return date.toISOString().replace("T", " ").substring(0, 19);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "csv":
        return <FileText className="h-4 w-4" />;
      case "sqlite":
        return <Database className="h-4 w-4" />;
      case "json":
      case "parquet":
        return <Table className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const copySchema = () => {
    if (!selectedFile) return;

    const schemaText = selectedFile.columns
      .map(
        (col) =>
          `${col.name} ${col.type}${col.nullable ? " NULL" : " NOT NULL"}`
      )
      .join("\n");

    navigator.clipboard.writeText(schemaText);
    toast.success("Schema copied to clipboard");
  };

  const viewFullSchema = () => {
    // In a real app, this would open a modal or navigate to a detailed view
    toast.success("Opening full schema view");
  };

  if (uploadedFiles.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            File Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <HardDrive className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No files uploaded yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Aggregated statistics for multiple files
  const totalFiles = fileMetadata.length;
  const totalSize = fileMetadata.reduce((sum, file) => sum + file.size, 0);
  const totalTables = fileMetadata.length;
  const totalRows = fileMetadata.reduce((sum, file) => sum + file.rowCount, 0);

  return (
    <Card className="h-full flex flex-col">
      <Collapsible open={!isMinimized} onOpenChange={setIsMinimized}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                File Details
              </CardTitle>
              {isMinimized ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="flex-1 space-y-4">
            {/* File Selector for Multiple Files */}
            {totalFiles > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select File</Label>
                <Select
                  value={selectedFileId || ""}
                  onValueChange={setSelectedFileId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a file" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileMetadata.map((file) => (
                      <SelectItem key={file.id} value={file.id}>
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.type)}
                          {file.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedFile && (
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  {/* File Properties */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          File Name
                        </Label>
                        <p className="text-sm font-medium break-all">
                          {selectedFile.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedFile.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(selectedFile.size)}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Uploaded
                        </Label>
                        <p className="text-xs">
                          {formatDate(selectedFile.uploadedAt)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Statistics */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            Rows
                          </Label>
                          <Badge variant="default" className="text-xs">
                            {selectedFile.rowCount.toLocaleString()}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Type className="h-3 w-3" />
                            Columns
                          </Label>
                          <Badge variant="default" className="text-xs">
                            {selectedFile.columnCount}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            Memory Usage
                          </Label>
                          <span className="text-xs">
                            {selectedFile.memoryUsage}%
                          </span>
                        </div>
                        <Progress
                          value={selectedFile.memoryUsage}
                          className="h-1"
                        />
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        {["INTEGER", "VARCHAR", "TIMESTAMP", "DECIMAL"].map(
                          (type, index) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="text-xs"
                            >
                              {type}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Table Schema Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Schema</CardTitle>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copySchema}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={viewFullSchema}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {selectedFile.columns.map((column, index) => (
                          <AccordionItem key={index} value={`column-${index}`}>
                            <AccordionTrigger className="text-xs py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {column.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {column.type}
                                </Badge>
                                {column.nullable && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    NULL
                                  </Badge>
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs">
                              <div className="space-y-2 pt-2">
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Data Type
                                  </Label>
                                  <p className="font-mono">{column.type}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground">
                                    Nullable
                                  </Label>
                                  <p>{column.nullable ? "Yes" : "No"}</p>
                                </div>
                                {column.sampleValues && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground">
                                      Sample Values
                                    </Label>
                                    <div className="space-y-1 mt-1">
                                      {column.sampleValues
                                        .slice(0, 3)
                                        .map((value, i) => (
                                          <div
                                            key={i}
                                            className="font-mono text-xs bg-muted px-2 py-1 rounded"
                                          >
                                            {value === null ? (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                NULL
                                              </Badge>
                                            ) : (
                                              value
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}

            {/* Aggregated Statistics for Multiple Files */}
            {totalFiles > 1 && (
              <>
                <Separator />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Total Files
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {totalFiles}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Combined Size
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(totalSize)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Total Tables
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {totalTables}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Total Rows
                      </span>
                      <Badge variant="default" className="text-xs">
                        {totalRows.toLocaleString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
