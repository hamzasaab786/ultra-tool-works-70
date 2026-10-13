import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import klipzaLogo from "@/assets/klipza-logo.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X, Search } from "lucide-react";
import { imageTools, pdfTools, calculatorTools, textTools, utilityTools, popularTools } from "@/data/toolIndex";
import { cn } from "@/lib/utils";
import ToolSearchDialog from "./ToolSearchDialog";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const location = useLocation();
  const popularRef = useRef<HTMLElement>(null);

  // A mouse wheel over the shortcut row scrolls it sideways instead of doing nothing.
  const onPopularWheel = (event: React.WheelEvent<HTMLElement>) => {
    const el = popularRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) el.scrollLeft += event.deltaY;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cmd/Ctrl + K opens the global tool search from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const ToolSection = ({ title, tools }: { title: string; tools: { name: string; path: string }[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4 w-[600px] bg-popover text-popover-foreground">
      <div className="col-span-full">
        <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      </div>
      {tools.map((tool) => (
        <Link
          key={tool.path}
          to={tool.path}
          className="block px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          {tool.name}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/95 border-b border-border/60 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center relative z-10">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={klipzaLogo}
              alt="Klipza brand logo"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-9 sm:w-9 transform transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Klipza
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex flex-1 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🖼️ Image Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Image Processing Tools" tools={imageTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  📄 PDF Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="PDF Management Tools" tools={pdfTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🧮 Calculators
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Calculator & Converter Tools" tools={calculatorTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  📝 Text Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Text Processing Tools" tools={textTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium bg-transparent">
                  🛠️ Utilities
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ToolSection title="Utility Tools" tools={utilityTools} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/blog/">Blog</Link>
            </Button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              aria-label="Search tools"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search tools</span>
              <kbd className="hidden lg:inline rounded border border-border/70 bg-background px-1.5 text-[10px] font-medium">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="xl:hidden flex items-center gap-2 ml-auto">
          <Button asChild variant="ghost" size="sm">
            <Link to="/blog/" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          </Button>
          <Button variant="ghost" size="sm" aria-label="Search tools" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Direct shortcuts to the most-used tool pages */}
      <div className="relative hidden sm:block border-t border-border/40">
        <div className="container mx-auto px-4 py-2">
          <nav
            ref={popularRef}
            onWheel={onPopularWheel}
            aria-label="Popular tools"
            className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden"
          >
            <span className="shrink-0 pr-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Popular
            </span>
            {popularTools.map((tool) => {
              const isActive = location.pathname === tool.path;
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {tool.name}
                </Link>
              );
            })}
            <Link
              to="/#category-0"
              className="shrink-0 whitespace-nowrap rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                if (location.pathname !== "/") return;
                setTimeout(() => {
                  document.getElementById("category-0")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              All Tools →
            </Link>
          </nav>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background via-background/70 to-transparent"
        />
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden py-4 border-t bg-background/95 backdrop-blur-xl transition-colors duration-300 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <div className="container mx-auto px-4">
            <div className="space-y-4">
              <div>
                <Link
                  to="/#category-0"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-0')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🖼️ Image Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {imageTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-1"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-1')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  📄 PDF Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {pdfTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-2"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-2')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🧮 Calculators
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {calculatorTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-3"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-3')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  📝 Text Tools
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {textTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  to="/#category-4"
                  className="font-semibold text-foreground mb-2 block hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('category-4')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  🛠️ Utilities
                </Link>
                <div className="grid grid-cols-1 gap-1 ml-4">
                  {utilityTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToolSearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
};

export default Navigation;
