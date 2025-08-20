"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
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
      <div className="flex h-screen w-full">
        {/* Left Sidebar - Schema Explorer - Hidden on mobile */}
        {(!isMobile || showSidebars) && (
          <div className={`${isMobile ? 'absolute inset-0 z-50 bg-background' : ''}`}>
            <SchemaExplorer 
              uploadedFiles={uploadedFiles} 
              sessionId={sessionId}
              onFilesUploaded={setUploadedFiles}
              onTablesChanged={handleTablesChanged}
              onClose={isMobile ? () => setShowSidebars(false) : undefined}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <DashboardHeader 
            sessionId={sessionId} 
            onToggleSidebars={isMobile ? () => setShowSidebars(!showSidebars) : undefined}
            showSidebars={showSidebars}
            isMobile={isMobile}
          />

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
                  />
                </div>
              </div>
            ) : isTablet ? (
              /* Tablet Layout - Simplified resizable */
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
                <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="flex h-full">
                    <div className="flex-1">
                      <ResultsDisplay
                        results={queryResults}
                        isExecuting={isExecuting}
                      />
                    </div>
                    <div className="w-80 border-l">
                      <MetadataPanel tables={tables} sessionId={sessionId} />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              /* Desktop Layout - Full resizable panels */
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Central Work Area */}
                <ResizablePanel defaultSize={75} minSize={60}>
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
                    <ResizablePanel defaultSize={50} minSize={30}>
                      <ResultsDisplay
                        results={queryResults}
                        isExecuting={isExecuting}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Sidebar - Metadata Panel */}
                <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                  <MetadataPanel tables={tables} sessionId={sessionId} />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>

          {/* Footer */}
          <DashboardFooter />
        </div>

        {/* Toast Notifications */}
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
