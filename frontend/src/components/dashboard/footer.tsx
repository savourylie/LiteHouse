"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Github, BookOpen } from "lucide-react";

export function DashboardFooter() {
  const sessionDuration = "00:15:32";
  const memoryUsage = 45;
  const lastQueryTime = "125ms";
  const totalQueries = 7;

  return (
    <footer className="border-t bg-muted/30 px-6 py-2">
      <div className="flex items-center justify-between text-xs">
        {/* Status Information */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">DuckDB Connected</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Session:</span>
            <span className="font-mono">{sessionDuration}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Memory:</span>
            <div className="flex items-center gap-1">
              <Progress value={memoryUsage} className="w-16 h-1" />
              <span className="font-mono">{memoryUsage}%</span>
            </div>
          </div>
        </div>

        {/* Center - Quick Links */}
        <div className="flex items-center gap-3">
          <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1">
            <BookOpen className="h-3 w-3" />
            Documentation
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1">
            <Github className="h-3 w-3" />
            GitHub
          </Button>
          <span className="text-muted-foreground">v1.0.0</span>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Last Query:</span>
            <Badge variant="outline" className="text-xs font-mono">
              {lastQueryTime}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Total Queries:</span>
            <Badge variant="outline" className="text-xs font-mono">
              {totalQueries}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
