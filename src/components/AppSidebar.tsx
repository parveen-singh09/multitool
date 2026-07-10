import * as React from "react";
import { useState, useEffect } from "react";
import {
  FileText,
  Code,
  Image as ImageIcon,
  RefreshCw,
  Calculator,
  Sparkles,
  Shield,
  Video,
  ChevronRight,
  Home,
  BookOpen,
  Search
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { tools, categories } from "../data/tools";

interface AppSidebarProps {
  currentPath: string;
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Text: FileText,
  Developer: Code,
  Image: ImageIcon,
  Converters: RefreshCw,
  Calculators: Calculator,
  Generators: Sparkles,
  Security: Shield,
  PDF: FileText,
  "Audio & Video": Video,
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // Normalize path by stripping trailing slashes for active tab comparisons
  const normalizedPath = currentPath.replace(/\/$/, "");

  // Initialize and update open/closed categories when searchQuery or path changes
  useEffect(() => {
    const nextOpen: Record<string, boolean> = {};
    categories.forEach((cat) => {
      if (searchQuery !== "") {
        nextOpen[cat] = true;
      } else {
        const categoryTools = tools.filter((t) => t.category === cat);
        const isActiveCategory = categoryTools.some(
          (tool) => `/tools/${tool.slug}` === normalizedPath
        );
        nextOpen[cat] = isActiveCategory;
      }
    });
    setOpenCategories(nextOpen);
  }, [searchQuery, normalizedPath]);

  // Filter tools based on search query
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Brand logo header */}
      <SidebarHeader className="border-b border-sidebar-border/50 px-5 py-3.5 flex h-14 items-center justify-between">
        <a href="/" className="inline-flex items-center gap-2 no-underline" aria-label="ToolCities home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="10" width="5" height="11" rx="1.2" fill="#5e6ad2" />
            <rect x="9.5" y="5" width="5" height="16" rx="1.2" fill="#828fff" />
            <rect x="16" y="13" width="5" height="8" rx="1.2" fill="#5e6ad2" />
          </svg>
          <span className="font-display font-semibold text-[15px] tracking-[-0.01em] text-ink">
            Tool<span className="text-ink-subtle">Cities</span>
          </span>
        </a>
      </SidebarHeader>

      {/* Filter / Search input */}
      <div className="px-4 py-3 border-b border-sidebar-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ink-subtle" />
          <Input
            type="search"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8.5 h-9 bg-surface-2 border-hairline text-ink placeholder:text-ink-subtle text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>
      </div>

      <SidebarContent className="py-2">
        {/* Navigation Home / About */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={normalizedPath === ""}>
                <a href="/">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={normalizedPath === "/about"}>
                <a href="/about">
                  <BookOpen className="h-4 w-4" />
                  <span>About</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories Tree */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-ink-subtle px-3 py-1">Districts & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => {
                const Icon = categoryIcons[category] || FileText;
                const categoryTools = filteredTools.filter((t) => t.category === category);

                // If searching, hide categories that have no matching tools
                if (categoryTools.length === 0) return null;

                const isOpen = openCategories[category] || false;

                return (
                  <Collapsible
                    key={category}
                    open={isOpen}
                    onOpenChange={(openVal) =>
                      setOpenCategories((prev) => ({ ...prev, [category]: openVal }))
                    }
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-ink-subtle" />
                            <span>{category}</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-ink-subtle transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down overflow-hidden">
                        <SidebarMenuSub className="ml-5 border-l border-sidebar-border/50 pl-2">
                          {categoryTools.map((tool) => {
                            const isToolActive = `/tools/${tool.slug}` === normalizedPath;
                            return (
                              <SidebarMenuSubItem key={tool.slug}>
                                <SidebarMenuSubButton asChild isActive={isToolActive}>
                                  <a
                                    href={`/tools/${tool.slug}`}
                                    className={`block py-1 text-sm ${
                                      isToolActive
                                        ? "text-primary-hover font-medium"
                                        : "text-ink-muted hover:text-ink"
                                    }`}
                                  >
                                    {tool.name}
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
