"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, HelpCircle, RotateCcw, Menu } from "lucide-react";

interface DashboardHeaderProps {
  sessionId: string;
  onToggleSidebars?: () => void;
  isMobile?: boolean;
}

export function DashboardHeader({ sessionId, onToggleSidebars, isMobile }: DashboardHeaderProps) {
  const handleClearSession = () => {
    // TODO: Implement clear session logic
    window.location.reload();
  };

  return (
    <header className="border-b bg-background px-3 md:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Brand and Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && onToggleSidebars && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleSidebars}
              className="p-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h1 className="text-lg md:text-xl font-semibold">LiteHouse</h1>
            </div>
            {!isMobile && (
              <Badge variant="secondary" className="text-xs">
                SQL Workbench
              </Badge>
            )}
          </div>
        </div>

        {/* Center - Session Information (hidden on mobile) */}
        {!isMobile && (
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
        )}

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {isMobile ? (
            /* Mobile - Only essential buttons */
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSession}
                className="p-2"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </>
          ) : (
            /* Desktop - Full buttons */
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
