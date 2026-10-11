import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  LEGAL_UPDATED,
  LEGAL_UPDATED_LABEL,
  legalDocBySlug,
  legalDocs,
  legalPath,
  type LegalBlock,
} from "@/data/legal";
import { siteInfo } from "@/data/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const doc = legalDocBySlug(params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead({
          title: `${loaderData.title} | Jowam Coffee Roasters`,
          description: loaderData.description,
          path: legalPath(loaderData.slug),
        })
      : { meta: [{ title: "Jowam Coffee Roasters" }] },
  notFoundComponent: LegalNotFound,
  component: LegalPage,
});

function LegalNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-5 font-display text-5xl">We couldn't find that page.</h1>
      <Button asChild className="mt-8">
        <Link to="/legal/$slug" params={{ slug: "terms" }}>
          Read our Terms of Sale
        </Link>
      </Button>
    </main>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="list-disc space-y-2 pl-5">
      {block.list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LegalPage() {
  const doc = Route.useLoaderData();
  const others = legalDocs.filter((d) => d.slug !== doc.slug);
  return (
    <main className="mx-auto max-w-screen-xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">{doc.title}</h1>
      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Last updated <time dateTime={LEGAL_UPDATED}>{LEGAL_UPDATED_LABEL}</time>
      </p>
      <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        {doc.summary}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="On this page" className="h-fit lg:sticky lg:top-28">
          <p className="eyebrow">On this page</p>
          <ol className="mt-4 space-y-2 text-sm">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-muted-foreground hover:text-foreground">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl">
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 pb-10">
              <h2 className="font-display text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-7">
                {section.body.map((block, index) => (
                  <Block key={index} block={block} />
                ))}
              </div>
            </section>
          ))}

          <aside className="border-t border-border pt-8 text-sm leading-6">
            <p className="eyebrow">Questions</p>
            <p className="mt-3 text-muted-foreground">
              Email{" "}
              <a href={`mailto:${siteInfo.contact.hello}`} className="underline underline-offset-4">
                {siteInfo.contact.hello}
              </a>{" "}
              or call {siteInfo.contact.phone}.
            </p>
            <p className="eyebrow mt-8">Other policies</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    to="/legal/$slug"
                    params={{ slug: other.slug }}
                    className="underline underline-offset-4"
                  >
                    {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
