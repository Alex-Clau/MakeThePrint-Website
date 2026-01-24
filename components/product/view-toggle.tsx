"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { ViewToggleProps } from "@/types/components";

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("grid")}
        className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("list")}
        className="h-10 w-10 sm:h-9 sm:w-9 touch-manipulation"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

