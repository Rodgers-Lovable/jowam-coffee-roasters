import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { navItems } from "@/data/jowam";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function Brand() {
  return (
    <Link to="/" className="group inline-flex flex-col leading-none" aria-label="Jowam Coffee Roasters home">
      <span className="font-display text-[1.7rem] font-semibold leading-[0.75]">Jowam</span>
      <span className="mt-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Coffee Roasters</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="nav-link text-xs font-semibold uppercase text-foreground/75" activeProps={{ className: "nav-link text-xs font-semibold uppercase text-foreground" }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon" aria-label="Shopping bag">
            <Link to="/shop"><ShoppingBag /></Link>
          </Button>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open menu"><Menu /></Button></SheetTrigger>
              <SheetContent className="flex w-full flex-col border-l-border bg-background p-7 sm:max-w-md">
                <SheetTitle className="font-display text-3xl">Jowam</SheetTitle>
                <SheetDescription>Coffee, food, and good company.</SheetDescription>
                <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <Link to={item.to} className="border-t border-border py-4 font-display text-3xl last:border-b">{item.label}</Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
                  <SheetClose asChild><Button asChild variant="outline" size="sm"><Link to="/menu">Menu</Link></Button></SheetClose>
                  <SheetClose asChild><Button asChild variant="outline" size="sm"><Link to="/visit">Visit</Link></Button></SheetClose>
                  <SheetClose asChild><Button asChild variant="default" size="sm"><Link to="/shop">Shop</Link></Button></SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
