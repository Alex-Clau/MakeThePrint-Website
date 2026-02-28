"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid, List } from "lucide-react";
import { ViewToggleProps } from "@/types/components";

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) => value && onViewChange(value as "grid" | "list")}
      variant="outline"
      size="lg"
      className="touch-manipulation [&>button]:h-10 [&>button]:w-10 [&>button]:min-w-10 [&>button]:p-0 sm:[&>button]:h-9 sm:[&>button]:w-9 sm:[&>button]:min-w-9"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

