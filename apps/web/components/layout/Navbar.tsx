"use client";

import { useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetOverlay,  } from "../ui/Sheet";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LogInIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { NavBarConfig } from "@/constants";
import { SearchModal } from "../ui/SearchModal";


export default function NavBar(props: NavBarConfig) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  
  const toggleGroup = (label: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 ">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground z-20">
            {/* <Logo  
              className="h-4 w-4 text-blue-300"
            /> */}
            {/* {props.brand} */}
            <Logo width={150} height={40} color="hsl(var(--brand))" />
          </Link>

          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList>
              {(props.items ?? []).map((item, idx) => (
                <NavigationMenuItem key={idx}>
                  {item.href ? (
                    <NavigationMenuLink asChild className="rounded-sm p-2 text-foreground hover:bg-primary">
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="rounded-sm p-2 text-foreground hover:bg-primary data-[state=open]:bg-primary hover:text-primary-foreground">
                        {item.label}
                      </NavigationMenuTrigger>
                      {item.megaMenu ? (
                        <NavigationMenuContent className="bg-popover text-popover-foreground z-[60] border-border">
                          <div className="grid grid-cols-2 gap-8 p-6 md:w-[800px]">
                            {item.megaMenu.columns.map((column, colIdx) => (
                              <div key={colIdx}>
                                <h3 className="font-semibold text-foreground mb-4 text-lg">{column.title}</h3>
                                <ul className="space-y-3">
                                  {column.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                      <Link href={link.href} className="group block rounded-lg p-3 transition-colors duration-200 hover:bg-primary">
                                        <div className="mb-1 font-medium text-foreground group-hover:text-primary-foreground">{link.label}</div>
                                        {link.description && <div className="text-sm text-muted-foreground group-hover:text-primary-foreground/80">{link.description}</div>}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      ) : null}
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search Modal */}
          <SearchModal />
          
          {/* Sign In Button */}
          <Button asChild variant="default" className="gap-2">
            <Link href="/auth/login">
              <LogInIcon className="h-4 w-4" />
              ورود
            </Link>
          </Button>
        </div>

        <button onClick={toggleMobileMenu} className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 z-20" aria-label="تغییر منوی موبایل">
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetOverlay onClick={() => setIsMobileMenuOpen(false)} />
        <SheetContent side="right" className="w-80 flex flex-col">
          <SheetHeader className="shrink-0">
            <SheetTitle>{props.brand}</SheetTitle>
          </SheetHeader>
          
          {/* Mobile Search and Actions */}
          <div className="px-4 py-4 border-b border-border/50">
            {/* Mobile Search Modal */}
            <div className="mb-3">
              <SearchModal />
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" className="gap-2 flex-1 justify-start">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogInIcon className="h-4 w-4" />
                  ورود
                </Link>
              </Button>
              
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              {(props.items ?? []).map((item, idx) => (
                <div key={idx} className="border-b border-border/50 last:border-b-0">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center px-3 py-4 text-foreground hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1 my-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleGroup(item.label)}
                        className="flex items-center justify-between w-full px-3 py-4 text-left hover:bg-muted/50 transition-colors duration-200 rounded-lg mx-1 my-1"
                      >
                        <span className="font-medium text-foreground">{item.label}</span>
                        <svg
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                            expandedGroups.has(item.label) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {item.megaMenu && expandedGroups.has(item.label) && (
                        <div className="ml-6 pb-2 space-y-1">
                          {item.megaMenu.columns.map((column, colIdx) => (
                            <div key={colIdx}>
                              <h4 className="px-3 py-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {column.title}
                              </h4>
                              <div className="space-y-1">
                                {column.links.map((link, linkIdx) => (
                                  <Link
                                    key={linkIdx}
                                    href={link.href}
                                    className="flex flex-col px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors duration-200 rounded-md mx-1"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <span className="font-medium">{link.label}</span>
                                    {link.description && (
                                      <span className="text-xs text-muted-foreground/80 mt-1">
                                        {link.description}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      </Container>
    </header>
  );
}


