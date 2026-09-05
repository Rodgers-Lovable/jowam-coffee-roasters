import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-screen-2xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="grid gap-14 border-b border-ink-foreground/20 pb-16 lg:grid-cols-[1.35fr_2fr]">
          <div>
            <p className="font-display text-5xl leading-none sm:text-6xl">Stay for<br />another cup.</p>
            <p className="mt-7 max-w-md text-sm leading-6 text-ink-foreground/70">Coffee stories, new releases and what’s happening at Jowam.</p>
            <form className="mt-7 flex max-w-md border-b border-ink-foreground/45" onSubmit={(event) => event.preventDefault()}>
              <Input aria-label="Email address" type="email" placeholder="Email address" className="h-12 rounded-none border-0 px-0 text-ink-foreground shadow-none placeholder:text-ink-foreground/50 focus-visible:ring-0" />
              <Button type="submit" variant="footer" size="icon" aria-label="Join newsletter"><ArrowRight /></Button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterGroup title="Visit" links={[["Location", "/visit"], ["Opening hours", "/visit"], ["Directions", "/visit"], ["Menu", "/menu"]]} />
            <FooterGroup title="Coffee" links={[["Shop", "/shop"], ["Our coffee", "/coffee"], ["Brew guides", "/coffee"], ["Experiences", "/coffee"]]} />
            <FooterGroup title="Jowam" links={[["Our story", "/our-story"], ["Wholesale", "/wholesale"], ["Training", "/coffee"], ["Contact", "/visit"]]} />
            <div>
              <p className="eyebrow text-ink-foreground/45">For now</p>
              <p className="mt-5 text-sm leading-6 text-ink-foreground/70">Location, hours, phone and email are awaiting confirmation.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-ink-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Jowam Coffee Roasters</p>
          <div className="flex gap-5"><span>Privacy</span><span>Terms</span><span>Shipping & returns</span></div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return <div><p className="eyebrow text-ink-foreground/45">{title}</p><ul className="mt-5 space-y-3">{links.map(([label, to]) => <li key={label}><Link to={to} className="text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground">{label}</Link></li>)}</ul></div>;
}
