import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2, Mail, MessageCircle } from "lucide-react";
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
import { enquiryForms, type EnquiryFormId } from "@/data/enquiry-forms";
import {
  buildEnquirySchema,
  buildMailto,
  buildWhatsApp,
  labelledFields,
  type EnquiryValues,
} from "@/lib/enquiry";
import { submitEnquiry } from "@/lib/enquiry.functions";

export function EnquiryForm({
  form: formId,
  submitLabel,
  inverse = false,
  preset,
}: {
  form: EnquiryFormId;
  submitLabel: string;
  inverse?: boolean;
  preset?: Record<string, string> | undefined;
}) {
  const { fields, shopTo, subject } = enquiryForms[formId];
  const schema = useMemo(() => buildEnquirySchema(fields), [fields]);
  const defaultValues = useMemo(
    () =>
      Object.fromEntries([
        ["company", ""],
        ...fields.map((f) => [f.name, f.type === "checkboxes" ? [] : ""]),
      ]) as EnquiryValues,
    [fields],
  );
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(schema) as unknown as Resolver<EnquiryValues>,
    defaultValues,
  });
  const [status, setStatus] = useState<
    { state: "sent" } | { state: "failed"; message: string; mailto: string } | null
  >(null);

  useEffect(() => {
    if (!preset) return;
    for (const [name, value] of Object.entries(preset))
      form.setValue(name, value, { shouldDirty: true });
  }, [preset, form]);

  const onSubmit = async (values: EnquiryValues) => {
    setStatus(null);
    try {
      await submitEnquiry({ data: { form: formId, values } });
      setStatus({ state: "sent" });
    } catch (err) {
      setStatus({
        state: "failed",
        message: err instanceof Error ? err.message : "We couldn’t send your message just now.",
        mailto: buildMailto(shopTo, subject(values), labelledFields(fields, values)),
      });
    }
  };

  const sendWhatsApp = form.handleSubmit((values) => {
    const link = buildWhatsApp(subject(values), labelledFields(fields, values));
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

  if (status?.state === "sent") {
    return (
      <div role="status" className="flex flex-col items-start gap-4">
        <CheckCircle2 className="size-10" />
        <p className="font-display text-4xl leading-none">Thanks, we have your message.</p>
        <p className={`max-w-md leading-7 ${muted}`}>
          We’ve emailed you a copy. Look out for our reply from {shopTo}.
        </p>
      </div>
    );
  }

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

        <div aria-hidden="true" className="hidden">
          <label>
            Company
            <input tabIndex={-1} autoComplete="off" {...form.register("company")} />
          </label>
        </div>

        <div className="flex flex-col gap-5 sm:col-span-2">
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              size="lg"
              variant={inverse ? "hero" : "default"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Mail />}
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
          <p className={`text-xs leading-5 ${muted}`}>We’ll email you a copy of your message.</p>
          {status?.state === "failed" && (
            <p role="alert" className="text-sm">
              {status.message}{" "}
              <a href={status.mailto} className="underline underline-offset-4">
                Send it from your email app instead
              </a>
              .
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
