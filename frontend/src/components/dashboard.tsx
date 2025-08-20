"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelLeftOpen } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { SchemaExplorer } from "@/components/dashboard/schema-explorer";
import { SqlEditor } from "@/components/dashboard/sql-editor";
import { ResultsDisplay } from "@/components/dashboard/results-display";
import { MetadataPanel } from "@/components/dashboard/metadata-panel";
import { DashboardFooter } from "@/components/dashboard/footer";
import { apiClient } from "@/lib/api";

export function Dashboard() {
  const [sessionId, setSessionId] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tables, setTables] = useState<any[]>([]);
  const [showSidebars, setShowSidebars] = useState(true);
  const [isSchemaExplorerCollapsed, setIsSchemaExplorerCollapsed] = useState(false);
  const [isMetadataPanelFolded, setIsMetadataPanelFolded] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const handleTablesChanged = useCallback((newTables: any[]) => {
    setTables(newTables);
  }, []);

  // Create real session with backend API
  useEffect(() => {
    const createSession = async () => {
      const response = await apiClient.createSession();
      if (response.data) {
        setSessionId(response.data.session_id);
        toast.success("Session created successfully");
      } else {
        toast.error(`Failed to create session: ${response.error}`);
      }
    };

    createSession();
  }, []);

  // Don't render until sessionId is generated to avoid hydration mismatch
  if (!sessionId) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Initializing session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        {/* Header - spans entire viewport width */}
        <DashboardHeader 
          sessionId={sessionId} 
          onToggleSidebars={isMobile ? () => setShowSidebars(!showSidebars) : undefined}
          isMobile={isMobile}
        />

        {/* Content Area - sidebar and main content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Schema Explorer - Hidden on mobile or when collapsed */}
          {(!isMobile || showSidebars) && !isSchemaExplorerCollapsed && (
            <div className={`${isMobile ? 'fixed top-[57px] left-0 right-0 bottom-0 z-50' : ''}`}>
              <SchemaExplorer 
                uploadedFiles={uploadedFiles} 
                sessionId={sessionId}
                onFilesUploaded={setUploadedFiles}
                onTablesChanged={handleTablesChanged}
                onClose={isMobile ? () => setShowSidebars(false) : undefined}
                onToggleCollapse={!isMobile ? () => setIsSchemaExplorerCollapsed(!isSchemaExplorerCollapsed) : undefined}
                isMobile={isMobile}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-col flex-1">
            {/* Main Content with Responsive Layout */}
            <div className="flex-1 p-2 md:p-4">
            {isMobile ? (
              /* Mobile Layout - Stack vertically */
              <div className="h-full flex flex-col space-y-2">
                {/* SQL Editor */}
                <div className="h-1/2">
                  <SqlEditor
                    onQueryExecute={setQueryResults}
                    isExecuting={isExecuting}
                    setIsExecuting={setIsExecuting}
                    sessionId={sessionId}
                    uploadedFiles={uploadedFiles}
                  />
                </div>
                
                {/* Results Display */}
                <div className="h-1/2">
                  <ResultsDisplay
                    results={queryResults}
                    isExecuting={isExecuting}
                  />
                </div>
                
                {/* Mobile Metadata Panel - Collapsible at bottom */}
                <div className="min-h-16">
                  <MetadataPanel 
                    tables={tables} 
                    sessionId={sessionId}
                    defaultCollapsed={true}
                    isMobile={true}
                    isFolded={isMetadataPanelFolded}
                    onToggleFold={() => setIsMetadataPanelFolded(!isMetadataPanelFolded)}
                  />
                </div>
              </div>
            ) : isTablet ? (
              /* Tablet Layout - Fixed sidebar with vertical resizable content */
              <div className="flex h-full overflow-hidden">
                {/* Central Work Area - Vertical layout */}
                <div className="flex-1 overflow-hidden min-w-0">
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    {/* SQL Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <SqlEditor
                        onQueryExecute={setQueryResults}
                        isExecuting={isExecuting}
                        setIsExecuting={setIsExecuting}
                        sessionId={sessionId}
                        uploadedFiles={uploadedFiles}
                      />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Results Display */}
                    <ResizablePanel defaultSize={50} minSize={30} className="overflow-hidden">
                      <ResultsDisplay
                        results={queryResults}
                        isExecuting={isExecuting}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
                
                {/* Fixed Right Sidebar - File Details (always reserve space) */}
                <div className="w-80 border-l bg-background flex-shrink-0">
                  {!isMetadataPanelFolded ? (
                    <MetadataPanel 
                      tables={tables} 
                      sessionId={sessionId} 
                      isFolded={isMetadataPanelFolded}
                      onToggleFold={() => setIsMetadataPanelFolded(!isMetadataPanelFolded)}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMetadataPanelFolded(false)}
                        className="h-12 w-12 rounded-full shadow-lg border-2 bg-background/95 backdrop-blur-sm"
                      >
                        <PanelRightOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Desktop Layout - Fixed sidebar with resizable central area */
              <div className="flex h-full overflow-hidden">
                {/* Central Work Area - Flexible */}
                <div className="flex-1 overflow-hidden min-w-0">
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    {/* SQL Editor */}
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <SqlEditor
                        onQueryExecute={setQueryResults}
                        isExecuting={isExecuting}
                        setIsExecuting={setIsExecuting}
                        sessionId={sessionId}
                        uploadedFiles={uploadedFiles}
                      />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Results Display */}
                    <ResizablePanel defaultSize={50} minSize={30} className="overflow-hidden">
                      <ResultsDisplay
                        results={queryResults}
                        isExecuting={isExecuting}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>

                {/* Fixed Right Sidebar - File Details (always reserve space) */}
                <div className="w-80 border-l bg-background flex-shrink-0">
                  {!isMetadataPanelFolded ? (
                    <MetadataPanel 
                      tables={tables} 
                      sessionId={sessionId}
                      isFolded={isMetadataPanelFolded}
                      onToggleFold={() => setIsMetadataPanelFolded(!isMetadataPanelFolded)}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMetadataPanelFolded(false)}
                        className="h-12 w-12 rounded-full shadow-lg border-2 bg-background/95 backdrop-blur-sm"
                      >
                        <PanelRightOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>

            {/* Footer */}
            <DashboardFooter />
          </div>
        </div>

        {/* Collapsed Schema Explorer Button */}
        {isSchemaExplorerCollapsed && !isMobile && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSchemaExplorerCollapsed(false)}
              className="h-12 w-12 rounded-full shadow-lg border-2 bg-background/95 backdrop-blur-sm"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </div>
        )}


        {/* Toast Notifications */}
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
