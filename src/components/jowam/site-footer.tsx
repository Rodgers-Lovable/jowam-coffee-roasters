import { Link } from "@tanstack/react-router";
import { siteInfo } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-screen-2xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="grid gap-14 border-b border-ink-foreground/20 pb-16 lg:grid-cols-[1.35fr_2fr]">
          <div>
            <p className="font-display text-5xl leading-none sm:text-6xl">Stay for<br />another cup.</p>
            <p className="mt-7 max-w-md text-sm leading-6 text-ink-foreground/70">A café and coffee roastery at Lavington Mall, Nairobi. Coffee we roast ourselves and a kitchen that keeps you fed all day.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterGroup title="Visit" links={[["Location & hours", "/visit"], ["Menu", "/menu"]]} />
            <FooterGroup title="Coffee" links={[["Shop", "/shop"], ["Our coffee", "/coffee"], ["Brewing", "/coffee", "brewing"], ["Experiences", "/experiences"]]} />
            <FooterGroup title="Jowam" links={[["Our story", "/our-story"], ["Wholesale", "/wholesale"], ["Barista training", "/experiences", "training"], ["Private events", "/experiences", "register"]]} />
            <div>
              <p className="eyebrow text-ink-foreground/45">Find us</p>
              <address className="mt-5 text-sm not-italic leading-6 text-ink-foreground/70">
                {siteInfo.addressLine}
                <br />
                {siteInfo.city}
              </address>
              <p className="mt-4 text-sm leading-6 text-ink-foreground/70">{siteInfo.hoursSummary}</p>
              <a href={`mailto:${siteInfo.contact.hello}`} className="mt-4 block break-all text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground">{siteInfo.contact.hello}</a>
            </div>
          </div>
        </div>
        <div className="pt-7 text-xs text-ink-foreground/55">
          <p>© {new Date().getFullYear()} Jowam Coffee Roasters</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: readonly (readonly [string, string, string?])[] }) {
  return <div><p className="eyebrow text-ink-foreground/45">{title}</p><ul className="mt-5 space-y-3">{links.map(([label, to, hash]) => <li key={label}><Link to={to} {...(hash ? { hash } : {})} className="text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground">{label}</Link></li>)}</ul></div>;
}
