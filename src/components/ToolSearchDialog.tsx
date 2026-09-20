import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { toolCatalog, getToolAliases } from "@/data/toolIndex";
import { getRecentTools, recordRecentTool, type RecentTool } from "@/lib/recentTools";

interface ToolSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ToolSearchDialog = ({ open, onOpenChange }: ToolSearchDialogProps) => {
  const navigate = useNavigate();
  const [recents, setRecents] = useState<RecentTool[]>([]);

  useEffect(() => {
    if (open) setRecents(getRecentTools());
  }, [open]);

  const groups = useMemo(() => toolCatalog, []);

  const go = (path: string, title: string) => {
    recordRecentTool(path, title);
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search tools — PDF, image, calculator, text…" />
      <CommandList>
        <CommandEmpty>No tool matches your search.</CommandEmpty>

        {recents.length > 0 && (
          <>
            <CommandGroup heading="Recently used">
              {recents.map((tool) => (
                <CommandItem
                  key={`recent-${tool.path}`}
                  value={`recent ${tool.title}`}
                  onSelect={() => go(tool.path, tool.title)}
                >
                  <Search className="mr-2 h-4 w-4 opacity-60" />
                  {tool.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {groups.map((group) => (
          <CommandGroup key={group.id} heading={`${group.emoji} ${group.label}`}>
            {group.tools.map((tool) => (
              <CommandItem
                key={tool.path}
                value={`${tool.name} ${group.label} ${tool.path} ${getToolAliases(tool.path)}`}
                onSelect={() => go(tool.path, tool.name)}
              >
                {tool.name}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default ToolSearchDialog;
