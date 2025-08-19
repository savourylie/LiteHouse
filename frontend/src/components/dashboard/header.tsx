"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Database, HelpCircle, RotateCcw } from "lucide-react";

interface DashboardHeaderProps {
  sessionId: string;
}

export function DashboardHeader({ sessionId }: DashboardHeaderProps) {
  const handleClearSession = () => {
    // TODO: Implement clear session logic
    window.location.reload();
  };

  return (
    <header className="border-b bg-background px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Brand and Sidebar Trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">LiteHouse</h1>
            </div>
            <Badge variant="secondary" className="text-xs">
              SQL Workbench
            </Badge>
          </div>
        </div>

        {/* Center - Session Information */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Session:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {sessionId.slice(-8)}
            </Badge>
          </div>
          <Badge variant="default" className="text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
            Connected
          </Badge>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSession}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Session
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
        </div>
      </div>
    </header>
  );
}
