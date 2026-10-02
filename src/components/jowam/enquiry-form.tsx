import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteInfo } from "@/data/site";
import { buildMailto, buildWhatsApp, type EnquiryFields } from "@/lib/enquiry";

type BaseField = { name: string; label: string; required?: boolean; wide?: boolean };
export type EnquiryField =
  | (BaseField & { type: "text" | "email" | "tel" | "textarea"; placeholder?: string })
  | (BaseField & { type: "select" | "radio" | "checkboxes"; options: readonly string[] });

type Values = Record<string, string | string[]>;

function buildSchema(fields: readonly EnquiryField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    if (field.type === "checkboxes") {
      shape[field.name] = field.required
        ? z.array(z.string()).min(1, "Choose at least one option")
        : z.array(z.string());
    } else if (field.type === "email") {
      shape[field.name] = field.required
        ? z.string().trim().email("Enter a valid email address")
        : z.union([z.literal(""), z.string().trim().email("Enter a valid email address")]);
    } else {
      shape[field.name] = field.required
        ? z.string().trim().min(1, `${field.label} is required`)
        : z.string().trim();
    }
  }
  return z.object(shape);
}

export function EnquiryForm({
  fields,
  subject,
  submitLabel,
  inverse = false,
  preset,
}: {
  fields: readonly EnquiryField[];
  subject: (values: Values) => string;
  submitLabel: string;
  inverse?: boolean;
  preset?: Record<string, string> | undefined;
}) {
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaultValues = useMemo(
    () =>
      Object.fromEntries(fields.map((f) => [f.name, f.type === "checkboxes" ? [] : ""])) as Values,
    [fields],
  );
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues });
  const [sent, setSent] = useState<{ mailto: string; whatsapp: string | null } | null>(null);

  useEffect(() => {
    if (!preset) return;
    for (const [name, value] of Object.entries(preset))
      form.setValue(name, value, { shouldDirty: true });
  }, [preset, form]);

  const toEnquiry = (values: Values): EnquiryFields =>
    Object.fromEntries(fields.map((f) => [f.label, values[f.name]]));

  const onSubmit = (values: Values) => {
    const title = subject(values);
    const links = {
      mailto: buildMailto(title, toEnquiry(values)),
      whatsapp: buildWhatsApp(title, toEnquiry(values)),
    };
    setSent(links);
    window.location.href = links.mailto;
  };

  const sendWhatsApp = form.handleSubmit((values) => {
    const link = buildWhatsApp(subject(values), toEnquiry(values));
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  });

  const line = inverse
    ? "border-ink-foreground/40 focus-visible:border-ink-foreground placeholder:text-ink-foreground/55 data-[placeholder]:text-ink-foreground/55"
    : "border-foreground/30 focus-visible:border-foreground";
  const control = `h-12 rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 ${line}`;
  const choice = inverse
    ? "border-ink-foreground data-[state=checked]:bg-ink-foreground data-[state=checked]:text-ink"
    : "";
  const label = `eyebrow ${inverse ? "text-ink-foreground/70" : "text-muted-foreground"}`;
  const message = inverse ? "text-ink-foreground" : "";
  const muted = inverse ? "text-ink-foreground/65" : "text-muted-foreground";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-x-10 gap-y-8 sm:grid-cols-2"
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: input }) => (
              <FormItem
                className={
                  field.wide ||
                  field.type === "textarea" ||
                  field.type === "radio" ||
                  field.type === "checkboxes"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <FormLabel className={label}>
                  {field.label}
                  {!field.required && (
                    <span className="normal-case tracking-normal"> (optional)</span>
                  )}
                </FormLabel>
                {(field.type === "text" || field.type === "email" || field.type === "tel") && (
                  <FormControl>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      className={control}
                      {...input}
                      value={input.value as string}
                    />
                  </FormControl>
                )}
                {field.type === "textarea" && (
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={field.placeholder}
                      className={`min-h-28 resize-y rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0 ${line}`}
                      {...input}
                      value={input.value as string}
                    />
                  </FormControl>
                )}
                {field.type === "select" && (
                  <Select onValueChange={input.onChange} value={input.value as string}>
                    <FormControl>
                      <SelectTrigger className={control}>
                        <SelectValue placeholder="Choose one" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === "radio" && (
                  <FormControl>
                    <RadioGroup
                      onValueChange={input.onChange}
                      value={input.value as string}
                      className="mt-2 grid gap-x-8 gap-y-3 sm:grid-cols-2"
                    >
                      {field.options.map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 border-b border-current/15 py-2 text-sm"
                        >
                          <RadioGroupItem value={option} className={choice} />
                          {option}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
                {field.type === "checkboxes" && (
                  <div className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
                    {field.options.map((option) => {
                      const selected = input.value as string[];
                      return (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 text-sm"
                        >
                          <Checkbox
                            className={choice}
                            checked={selected.includes(option)}
                            onCheckedChange={(checked) =>
                              input.onChange(
                                checked
                                  ? [...selected, option]
                                  : selected.filter((v) => v !== option),
                              )
                            }
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                )}
                <FormMessage className={message} />
              </FormItem>
            )}
          />
        ))}

        <div className="flex flex-col gap-5 sm:col-span-2">
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" variant={inverse ? "hero" : "default"}>
              <Mail />
              {submitLabel}
              <ArrowRight />
            </Button>
            {siteInfo.contact.whatsapp && (
              <Button
                type="button"
                size="lg"
                variant={inverse ? "heroOutline" : "outline"}
                onClick={sendWhatsApp}
              >
                <MessageCircle />
                Send via WhatsApp
              </Button>
            )}
          </div>
          <p className={`text-xs leading-5 ${muted}`}>
            Sending opens your email app with your details filled in.
            {siteInfo.contact.isPlaceholder &&
              " Our email inbox is still being set up, so if you don’t hear back within a few days, ask for us at the café."}
          </p>
          {sent && (
            <p role="status" className="text-sm">
              Email app didn’t open?{" "}
              <a href={sent.mailto} className="underline underline-offset-4">
                Try again
              </a>
              {sent.whatsapp && (
                <>
                  {" "}
                  or{" "}
                  <a
                    href={sent.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    message us on WhatsApp
                  </a>
                </>
              )}
              .
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
