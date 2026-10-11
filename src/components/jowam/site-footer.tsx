import { Link } from "@tanstack/react-router";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { legalDocs } from "@/data/legal";
import { siteInfo } from "@/data/site";
import logo from "@/assets/logo-256.jpg";

const socialIcons = { Instagram: SiInstagram, TikTok: SiTiktok } as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-screen-2xl px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="grid gap-14 border-b border-ink-foreground/20 pb-16 lg:grid-cols-[1.35fr_2fr]">
          <div>
            <Link to="/" aria-label="Jowam Coffee Roasters home" className="mb-8 inline-block">
              <img
                src={logo}
                alt="Jowam Coffee Roasters logo"
                width={128}
                height={128}
                className="size-28 rounded-full object-contain sm:size-32"
              />
            </Link>
            <p className="font-display text-5xl leading-none sm:text-6xl">
              Stay for
              <br />
              another cup.
            </p>
            <p className="mt-7 max-w-md text-sm leading-6 text-ink-foreground/70">
              A café and coffee roastery at Lavington Mall, Nairobi. Coffee we roast ourselves and a
              kitchen that keeps you fed all day.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterGroup
              title="Visit"
              links={[
                ["Location & hours", "/visit"],
                ["Menu", "/menu"],
              ]}
            />
            <FooterGroup
              title="Coffee"
              links={[
                ["Shop", "/shop"],
                ["Our coffee", "/coffee"],
                ["Brewing", "/coffee", "brewing"],
                ["Experiences", "/experiences"],
              ]}
            />
            <FooterGroup
              title="Jowam"
              links={[
                ["Our story", "/our-story"],
                ["Wholesale", "/wholesale"],
                ["Barista training", "/experiences", "training"],
                ["Private events", "/experiences", "register"],
              ]}
            />
            <div>
              <p className="eyebrow text-ink-foreground/45">Find us</p>
              <address className="mt-5 text-sm not-italic leading-6 text-ink-foreground/70">
                {siteInfo.addressLine}
                <br />
                {siteInfo.city}
              </address>
              <p className="mt-4 text-sm leading-6 text-ink-foreground/70">
                {siteInfo.hoursSummary}
              </p>
              <a
                href={`mailto:${siteInfo.contact.hello}`}
                className="mt-4 block break-all text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground"
              >
                {siteInfo.contact.hello}
              </a>
              <a
                href={`tel:${siteInfo.contact.phone.replaceAll(" ", "")}`}
                className="mt-2 block whitespace-nowrap text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground"
              >
                {siteInfo.contact.phone}
              </a>
              <ul className="mt-5 flex gap-4">
                {siteInfo.socials.map(({ label, url }) => {
                  const Icon = socialIcons[label];
                  return (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Jowam on ${label}`}
                        className="text-ink-foreground/75 transition-colors hover:text-ink-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-ink-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Jowam Coffee Roasters</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalDocs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    to="/legal/$slug"
                    params={{ slug: doc.slug }}
                    className="transition-colors hover:text-ink-foreground"
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string, string?])[];
}) {
  return (
    <div>
      <p className="eyebrow text-ink-foreground/45">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map(([label, to, hash]) => (
          <li key={label}>
            <Link
              to={to}
              {...(hash ? { hash } : {})}
              className="text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
