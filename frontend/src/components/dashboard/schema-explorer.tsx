"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  FileText,
  Database,
  ChevronDown,
  ChevronRight,
  Upload,
} from "lucide-react";

interface SchemaExplorerProps {
  uploadedFiles: any[];
  sessionId: string;
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

export function SchemaExplorer({
  uploadedFiles,
  sessionId,
}: SchemaExplorerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

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
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  No tables loaded
                </p>
                <Alert>
                  <AlertDescription className="text-xs">
                    Upload CSV, Parquet, JSON, or SQLite files to explore your
                    data
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
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
