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
  Gauge,
  ChevronRight,
  Home,
  BookOpen,
  Search,
  Mail,
  MessageSquare,
  Coffee
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { tools, categories } from "../data/tools";
import { matchesQuery, toolHaystack, compareByQuery } from "../lib/toolSearch";

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
  "Device & Sensors": Gauge,
};

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const normalizedPath = currentPath.replace(/\/$/, "");

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

  // Filter tools using the shared header logic — same matcher, same fields.
  const filteredTools = tools.filter((tool) =>
    matchesQuery(toolHaystack(tool), searchQuery)
  );

  // While searching, show a flat ranked list (name-prefix first, alphabetical),
  // matching the explore grid and header dropdown.
  const isSearching = searchQuery.trim() !== "";
  const rankedTools = isSearching
    ? [...filteredTools].sort((a, b) => compareByQuery(a.name, b.name, searchQuery))
    : [];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Brand logo header */}
      <SidebarHeader className="border-b border-sidebar-border/50 px-5 py-3.5 flex h-14 flex-row items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <a href="/" className="inline-flex items-center gap-2 no-underline" aria-label="ToolSilk home">
          <span className="font-display font-semibold text-[15px] tracking-[-0.01em] text-ink">
            Tool<span className="text-ink-subtle">Silk</span>
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
              <SidebarMenuButton asChild isActive={normalizedPath === "/tools"}>
                <a href="/tools">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={normalizedPath === "/feedback"}>
                <a href="/feedback">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="https://ko-fi.com/toolsilk" target="_blank" rel="noopener noreferrer">
                  <Coffee className="h-4 w-4" />
                  <span>Buy me a coffee</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories Tree */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-ink-subtle px-3 py-1">Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isSearching && (
                rankedTools.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-ink-subtle">No tools match your search.</p>
                ) : (
                  <SidebarMenuSub className="ml-2 border-none pl-1">
                    {rankedTools.map((tool) => {
                      const isToolActive = `/tools/${tool.slug}` === normalizedPath;
                      return (
                        <SidebarMenuSubItem key={tool.slug}>
                          <SidebarMenuSubButton asChild isActive={isToolActive}>
                            <a
                              href={`/tools/${tool.slug}`}
                              className={`h-auto min-h-7 items-start overflow-visible whitespace-normal py-1.5 text-sm leading-snug ${
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
                )
              )}
              {!isSearching && categories.map((category) => {
                const Icon = categoryIcons[category] || FileText;
                const categoryTools = filteredTools.filter((t) => t.category === category);

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
                              <SidebarMenuSubItem
                                key={tool.slug}
                                className={`before:content-[''] before:absolute before:-left-2 before:top-3 before:h-2 before:w-2 before:-translate-x-1/2 before:rounded-full before:ring-2 before:ring-sidebar after:content-[''] after:absolute after:-left-2 after:top-4 after:h-px after:w-3 ${
                                  `/tools/${tool.slug}` === normalizedPath
                                    ? "before:bg-primary after:bg-primary/50"
                                    : "before:bg-sidebar-border after:bg-sidebar-border/60"
                                }`}
                              >
                                <SidebarMenuSubButton asChild isActive={isToolActive}>
                                  <a
                                    href={`/tools/${tool.slug}`}
                                    className={`h-auto min-h-7 items-start overflow-visible whitespace-normal py-1.5 text-sm leading-snug ${
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

      <SidebarFooter className="border-t border-sidebar-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={normalizedPath === "/about"}>
              <a href="/about">
                <BookOpen className="h-4 w-4" />
                <span>About</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={normalizedPath === "/contact"}>
              <a href="/contact">
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={normalizedPath === "/privacy"}>
              <a href="/privacy">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
