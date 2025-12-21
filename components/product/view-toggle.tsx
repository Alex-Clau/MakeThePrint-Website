"use client";

import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("grid")}
        className="h-9 w-9"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onViewChange("list")}
        className="h-9 w-9"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

