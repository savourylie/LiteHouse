"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { DashboardHeader } from "@/components/dashboard/header";
import { SchemaExplorer } from "@/components/dashboard/schema-explorer";
import { FileUploadZone } from "@/components/dashboard/file-upload-zone";
import { SqlEditor } from "@/components/dashboard/sql-editor";
import { ResultsDisplay } from "@/components/dashboard/results-display";
import { MetadataPanel } from "@/components/dashboard/metadata-panel";
import { DashboardFooter } from "@/components/dashboard/footer";

export function Dashboard() {
  const [sessionId, setSessionId] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Generate session ID only on client side to avoid hydration mismatch
  useEffect(() => {
    setSessionId(
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
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
        {/* Left Sidebar - Schema Explorer */}
        <SchemaExplorer uploadedFiles={uploadedFiles} sessionId={sessionId} />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <DashboardHeader sessionId={sessionId} />

          {/* Main Content with Resizable Panels */}
          <div className="flex-1 p-4">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              {/* Central Work Area */}
              <ResizablePanel defaultSize={75} minSize={60}>
                <ResizablePanelGroup direction="vertical" className="h-full">
                  {/* File Upload Zone */}
                  <ResizablePanel defaultSize={25} minSize={15}>
                    <FileUploadZone
                      onFilesUploaded={setUploadedFiles}
                      sessionId={sessionId}
                    />
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  {/* SQL Editor */}
                  <ResizablePanel defaultSize={35} minSize={25}>
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
                  <ResizablePanel defaultSize={40} minSize={25}>
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
                <MetadataPanel uploadedFiles={uploadedFiles} />
              </ResizablePanel>
            </ResizablePanelGroup>
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
