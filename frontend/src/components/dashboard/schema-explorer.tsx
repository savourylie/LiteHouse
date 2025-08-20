"use client";

import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUploadZone } from "./file-upload-zone";
import { apiClient, type TableInfo, type SchemaResponse } from "@/lib/api";
import {
  Table,
  FileText,
  Database,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  PanelLeftClose,
} from "lucide-react";

interface SchemaExplorerProps {
  uploadedFiles: any[];
  sessionId: string;
  onFilesUploaded: (files: any[]) => void;
  onTablesChanged: (tables: any[]) => void;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

interface TableWithSchema {
  info: TableInfo;
  schema?: SchemaResponse;
  isLoadingSchema: boolean;
}

export function SchemaExplorer({
  uploadedFiles,
  sessionId,
  onFilesUploaded,
  onTablesChanged,
  onClose,
  onToggleCollapse,
  isMobile,
}: SchemaExplorerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [tables, setTables] = useState<TableWithSchema[]>([]);
  const [isLoadingTables, setIsLoadingTables] = useState(false);

  // Fetch tables from backend when session changes
  useEffect(() => {
    if (!sessionId) return;

    const fetchTables = async () => {
      setIsLoadingTables(true);
      try {
        const response = await apiClient.getTables(sessionId);
        if (response.data) {
          const tablesWithSchema = response.data.map(tableInfo => ({
            info: tableInfo,
            schema: undefined,
            isLoadingSchema: false,
          }));
          setTables(tablesWithSchema);
          onTablesChanged(tablesWithSchema);
        }
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      } finally {
        setIsLoadingTables(false);
      }
    };

    fetchTables();
  }, [sessionId, uploadedFiles]); // Re-fetch when files are uploaded

  const toggleTableExpansion = async (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
      
      // Load schema if not already loaded
      const table = tables.find(t => t.info.name === tableName);
      if (table && !table.schema && !table.isLoadingSchema) {
        setTables(prev => 
          prev.map(t => 
            t.info.name === tableName 
              ? { ...t, isLoadingSchema: true }
              : t
          )
        );

        try {
          const response = await apiClient.getSchema(tableName, sessionId);
          if (response.data) {
            setTables(prev => 
              prev.map(t => 
                t.info.name === tableName 
                  ? { ...t, schema: response.data, isLoadingSchema: false }
                  : t
              )
            );
          }
        } catch (error) {
          console.error("Failed to fetch schema:", error);
          setTables(prev => 
            prev.map(t => 
              t.info.name === tableName 
                ? { ...t, isLoadingSchema: false }
                : t
            )
          );
        }
      }
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

  if (isMobile) {
    return (
      <Sidebar className="border-r w-full">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Schema</h3>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4 flex flex-col">
          <div className="flex-1">
            {tables.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Upload files to see tables and schemas
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {isLoadingTables && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                
                {tables.map((table) => (
                  <Card key={table.info.name} className="overflow-hidden">
                    <div className="p-3">
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto"
                        onClick={() => toggleTableExpansion(table.info.name)}
                      >
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(table.info.kind)}
                          <span className="font-medium text-sm">{table.info.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {table.info.kind.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {table.info.db && (
                            <Badge variant="outline" className="text-xs">
                              {table.info.db}
                            </Badge>
                          )}
                          {expandedTables.has(table.info.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </Button>

                      {expandedTables.has(table.info.name) && (
                        <div className="mt-3">
                          {table.isLoadingSchema ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2 text-xs text-muted-foreground">
                                Loading schema...
                              </span>
                            </div>
                          ) : table.schema?.columns ? (
                            <div className="space-y-1">
                              {table.schema.columns.map((column, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/50"
                                >
                                  <span className="font-medium">{column.name}</span>
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1 py-0"
                                  >
                                    {column.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground p-2">
                              No schema information available
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <FileUploadZone 
              sessionId={sessionId} 
              onFilesUploaded={onFilesUploaded} 
            />
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Desktop version - use a custom div instead of Sidebar to avoid fixed positioning
  return (
    <div className="border-r bg-sidebar text-sidebar-foreground w-64 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <h3 className="font-semibold">Schema</h3>
          </div>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-6 w-6 p-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {tables.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Upload files to see tables and schemas
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {isLoadingTables && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              
              {tables.map((table) => (
                <Card key={table.info.name} className="overflow-hidden">
                  <div className="p-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => toggleTableExpansion(table.info.name)}
                    >
                      <div className="flex items-center gap-2">
                        {getFileTypeIcon(table.info.kind)}
                        <span className="font-medium text-sm">{table.info.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {table.info.kind.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {table.info.db && (
                          <Badge variant="outline" className="text-xs">
                            {table.info.db}
                          </Badge>
                        )}
                        {expandedTables.has(table.info.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </Button>

                    {expandedTables.has(table.info.name) && (
                      <div className="mt-3">
                        {table.isLoadingSchema ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-xs text-muted-foreground">
                              Loading schema...
                            </span>
                          </div>
                        ) : table.schema?.columns ? (
                          <div className="space-y-1">
                            {table.schema.columns.map((column, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/50"
                              >
                                <span className="font-medium">{column.name}</span>
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {column.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground p-2">
                            No schema information available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <FileUploadZone 
            sessionId={sessionId} 
            onFilesUploaded={onFilesUploaded} 
          />
        </div>
      </div>
    </div>
  );
}