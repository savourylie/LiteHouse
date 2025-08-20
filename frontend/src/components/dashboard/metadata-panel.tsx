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
import { apiClient } from "@/lib/api";
import {
  FileText,
  Database,
  Table,
  ChevronDown,
  Copy,
  ExternalLink,
  Type,
  Eye,
  ChevronUp,
  HardDrive,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";

interface MetadataPanelProps {
  tables: any[];
  sessionId: string;
  defaultCollapsed?: boolean;
  isMobile?: boolean;
  isFolded?: boolean;
  onToggleFold?: () => void;
}


export function MetadataPanel({ tables, sessionId, defaultCollapsed = false, isMobile = false, isFolded = false, onToggleFold }: MetadataPanelProps) {
  const [selectedTableName, setSelectedTableName] = useState<string | null>(
    tables.length > 0 ? tables[0].info?.name : null
  );
  const [isMinimized, setIsMinimized] = useState(defaultCollapsed);
  const [selectedTableSchema, setSelectedTableSchema] = useState<any>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);

  // Update selected table when tables change
  useEffect(() => {
    if (tables.length > 0 && !selectedTableName) {
      setSelectedTableName(tables[0].info?.name);
    }
  }, [tables, selectedTableName]);

  // Load schema for selected table
  useEffect(() => {
    if (!selectedTableName || !sessionId) return;

    const table = tables.find(t => t.info?.name === selectedTableName);
    if (table?.schema) {
      setSelectedTableSchema(table.schema);
      return;
    }

    const loadSchema = async () => {
      setIsLoadingSchema(true);
      try {
        const response = await apiClient.getSchema(selectedTableName, sessionId);
        if (response.data) {
          setSelectedTableSchema(response.data);
        }
      } catch (error) {
        console.error("Failed to load schema:", error);
      } finally {
        setIsLoadingSchema(false);
      }
    };

    loadSchema();
  }, [selectedTableName, sessionId, tables]);

  const selectedTable = tables.find((t) => t.info?.name === selectedTableName);

  // If folded, show vertical bar
  if (isFolded) {
    return (
      <div className="fixed right-0 top-0 h-full z-50 w-16">
        <div className="h-full bg-slate-800 text-slate-100 border-l-2 border-slate-600 shadow-xl flex flex-col">
          {/* Top section with close button */}
          <div className="p-3 flex justify-center border-b border-slate-600">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFold}
              className="p-2 h-auto text-slate-100 hover:text-slate-800 hover:bg-slate-100"
            >
              <PanelRightClose className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Middle section with vertical text */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="writing-mode-vertical text-sm font-medium tracking-wide" style={{writingMode: 'vertical-rl', textOrientation: 'mixed'}}>
              FILE DETAILS
            </div>
            
            {tables.length > 0 && (
              <div className="flex flex-col items-center gap-3">
                <Eye className="h-6 w-6 text-slate-300" />
                <Badge variant="outline" className="text-xs px-2 py-1 border-slate-500 text-slate-200 bg-slate-700">
                  {tables.length}
                </Badge>
                <div className="writing-mode-vertical text-xs text-slate-400" style={{writingMode: 'vertical-rl', textOrientation: 'mixed'}}>
                  TABLES
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom section */}
          <div className="p-3 border-t border-slate-600 flex justify-center">
            <Database className="h-5 w-5 text-slate-400" />
          </div>
        </div>
      </div>
    );
  }

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
    if (!selectedTableSchema?.columns) return;

    const schemaText = selectedTableSchema.columns
      .map((col: any) => `${col.name} ${col.type}`)
      .join("\n");

    navigator.clipboard.writeText(schemaText);
    toast.success("Schema copied to clipboard");
  };

  const viewFullSchema = () => {
    // In a real app, this would open a modal or navigate to a detailed view
    toast.success("Opening full schema view");
  };

  if (tables.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              File Details
            </div>
            {onToggleFold && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFold}
                className="p-1 h-auto"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            )}
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

  // Aggregated statistics for multiple tables
  const totalTables = tables.length;

  return (
    <Card className={`${isMobile ? 'h-auto' : 'h-full'} flex flex-col`}>
        <Collapsible open={!isMinimized} onOpenChange={setIsMinimized}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between cursor-pointer">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  File Details
                </CardTitle>
                <div className="flex items-center gap-1">
                  {onToggleFold && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFold();
                      }}
                      className="p-1 h-auto"
                    >
                      {isFolded ? (
                        <PanelRightClose className="h-4 w-4" />
                      ) : (
                        <PanelRightOpen className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  {isMinimized ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
          </CardHeader>

        <CollapsibleContent>
          <CardContent className="flex-1 space-y-4">
            {/* Table Selector for Multiple Tables */}
            {totalTables > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Table</Label>
                <Select
                  value={selectedTableName || ""}
                  onValueChange={setSelectedTableName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.info.name} value={table.info.name}>
                        <div className="flex items-center gap-2">
                          {getFileIcon(table.info.kind)}
                          {table.info.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedTable && (
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  {/* Table Properties */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Table Name
                        </Label>
                        <p className="text-sm font-medium break-all">
                          {selectedTable.info.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {selectedTable.info.kind.toUpperCase()}
                        </Badge>
                        {selectedTable.info.db && (
                          <Badge variant="outline" className="text-xs">
                            {selectedTable.info.db}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schema Information */}
                  {selectedTableSchema && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <Type className="h-3 w-3" />
                              Columns
                            </Label>
                            <Badge variant="default" className="text-xs">
                              {selectedTableSchema.columns.length}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          {Array.from(new Set(selectedTableSchema.columns.map((col: any) => col.type)))
                            .slice(0, 4)
                            .map((type) => (
                              <Badge
                                key={type as string}
                                variant="outline"
                                className="text-xs"
                              >
                                {type as string}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Table Schema Details */}
                  {selectedTableSchema ? (
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
                          {selectedTableSchema.columns.map((column: any, index: number) => (
                            <AccordionItem key={index} value={`column-${index}`}>
                              <AccordionTrigger className="text-xs py-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {column.name}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {column.type}
                                  </Badge>
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
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ) : isLoadingSchema ? (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                          <span className="text-sm text-muted-foreground">Loading schema...</span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground text-center">
                          No schema information available
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            )}

            {/* Aggregated Statistics for Multiple Tables */}
            {totalTables > 1 && (
              <>
                <Separator />
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Total Tables
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {totalTables}
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
