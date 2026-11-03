import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronDown, Clock, Loader2, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { WhatsappIcon, InstagramIcon, LinkedinIcon, FacebookIcon, YoutubeIcon, GithubIcon } from "@/components/BrandIcons";
import { Button, Container, PageHero, Reveal } from "@/components/ui";
import { useCms } from "@/store/cms";
import { useSEO } from "@/hooks";
import { formatPhone, isValidEmail, whatsappLink } from "@/lib/utils";
import type { Settings } from "@/types";
import { cn } from "@/utils/cn";

interface FormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  consent: boolean;
  website: string; // honeypot anti-spam
}

const initial: FormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  subject: "",
  message: "",
  consent: false,
  website: "",
};

/** Envia a mensagem para o e-mail institucional por meio do provedor configurado no painel. */
async function deliverByEmail(data: FormData, settings: Settings): Promise<boolean> {
  const payload = {
    nome: data.name,
    empresa: data.company || "-",
    email: data.email,
    telefone: data.phone,
    servico: data.service,
    assunto: data.subject,
    mensagem: data.message,
    origem: "Site Khronos Tecnologia e Sistemas",
  };
  const headers = { "Content-Type": "application/json", Accept: "application/json" };

  if (settings.formProvider === "formspree" && settings.formspreeId) {
    const res = await fetch(`https://formspree.io/f/${settings.formspreeId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...payload, _replyto: data.email, _subject: `[Site] ${data.subject}` }),
    });
    return res.ok;
  }
  if (settings.formProvider === "web3forms" && settings.web3formsKey) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers,
      body: JSON.stringify({
        access_key: settings.web3formsKey,
        subject: `[Site] ${data.subject}`,
        from_name: data.name,
        replyto: data.email,
        ...payload,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { success?: boolean };
    return res.ok && json.success !== false;
  }
  if (settings.formProvider === "custom" && settings.customEndpoint) {
    const res = await fetch(settings.customEndpoint, { method: "POST", headers, body: JSON.stringify(payload) });
    return res.ok;
  }
  return false;
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-slate-200">
        {label} {optional && <span className="text-xs font-normal text-slate-500">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-erro`} role="alert" className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const { state, addMessage } = useCms();
  const s = state.settings;
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [delivered, setDelivered] = useState(false);

  useSEO({
    title: "Contato e orçamento",
    description:
      "Solicite um orçamento para sistemas, sites, aplicativos, automações e soluções com IA. Fale com a Khronos Tecnologia e Sistemas por formulário, e-mail ou WhatsApp.",
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (data.name.trim().length < 3) e.name = "Informe seu nome completo.";
    if (!isValidEmail(data.email)) e.email = "Informe um e-mail válido.";
    if (data.phone.replace(/\D/g, "").length < 10) e.phone = "Informe um telefone com DDD.";
    if (!data.service) e.service = "Selecione o tipo de serviço.";
    if (data.subject.trim().length < 3) e.subject = "Informe o assunto.";
    if (data.message.trim().length < 20) e.message = "Descreva sua necessidade com pelo menos 20 caracteres.";
    if (!data.consent) e.consent = "É necessário aceitar a política de privacidade.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (data.website) return; // bot detectado
    if (!validate()) {
      const firstError = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstError?.focus();
      return;
    }
    setStatus("sending");
    let ok = false;
    try {
      ok = await deliverByEmail(data, s);
    } catch {
      ok = false;
    }
    addMessage({
      name: data.name.trim(),
      company: data.company.trim() || undefined,
      email: data.email.trim(),
      phone: data.phone,
      service: data.service,
      subject: data.subject.trim(),
      message: data.message.trim(),
      delivered: ok,
    });
    setDelivered(ok);
    setStatus("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const waSummary = `Olá! Meu nome é ${data.name}. ${data.subject ? `Assunto: ${data.subject}. ` : ""}${data.message}`;

  const socials = [
    { href: s.social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: s.social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { href: s.social.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: s.social.youtube, icon: YoutubeIcon, label: "YouTube" },
    { href: s.social.github, icon: GithubIcon, label: "GitHub" },
  ].filter((x) => x.href);

  return (
    <>
      <PageHero
        eyebrow="Contato e orçamento"
        title={<>Vamos construir a sua <span className="text-gradient">próxima solução</span></>}
        description="Conte sobre o seu projeto ou desafio. Nossa equipe responde em até 24 horas úteis com os próximos passos."
      />

      <section className="pb-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Formulário */}
            <Reveal className="lg:col-span-7">
              <div className="rounded-[2rem] border border-white/8 bg-night-900/60 p-6 sm:p-10">
                {status === "success" ? (
                  <div className="py-6 text-center" role="status" aria-live="polite">
                    <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <CheckCircle2 className="size-8" />
                    </span>
                    <h2 className="mt-6 text-2xl font-bold text-white">Solicitação recebida com sucesso!</h2>
                    <p className="mx-auto mt-3 max-w-md text-slate-400">
                      Obrigado, {data.name.split(" ")[0]}. Registramos sua solicitação
                      {delivered ? " e enviamos uma cópia para nossa equipe" : ""}. Retornaremos pelo e-mail{" "}
                      <span className="text-white">{data.email}</span> ou WhatsApp em até 24 horas úteis.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                      <Button href={whatsappLink(s, waSummary)} external icon={<WhatsappIcon width={18} height={18} />} className="bg-[#25D366] bg-none text-white hover:brightness-105">
                        Agilizar pelo WhatsApp
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setData(initial);
                          setStatus("idle");
                        }}
                      >
                        Enviar outra mensagem
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Nome completo" htmlFor="name" error={errors.name}>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={data.name}
                          onChange={(e) => set("name", e.target.value)}
                          className="input-dark"
                          placeholder="Seu nome"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-erro" : undefined}
                          required
                        />
                      </Field>
                      <Field label="Empresa" htmlFor="company" optional>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={data.company}
                          onChange={(e) => set("company", e.target.value)}
                          className="input-dark"
                          placeholder="Nome da empresa"
                        />
                      </Field>
                      <Field label="E-mail" htmlFor="email" error={errors.email}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={data.email}
                          onChange={(e) => set("email", e.target.value)}
                          className="input-dark"
                          placeholder="voce@empresa.com.br"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-erro" : undefined}
                          required
                        />
                      </Field>
                      <Field label="Telefone / WhatsApp" htmlFor="phone" error={errors.phone}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          inputMode="numeric"
                          value={data.phone}
                          onChange={(e) => set("phone", formatPhone(e.target.value))}
                          className="input-dark"
                          placeholder="(11) 99999-9999"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-erro" : undefined}
                          required
                        />
                      </Field>
                      <Field label="Tipo de serviço desejado" htmlFor="service" error={errors.service}>
                        <div className="relative">
                          <select
                            id="service"
                            name="service"
                            value={data.service}
                            onChange={(e) => set("service", e.target.value)}
                            className="input-dark appearance-none pr-10 [&>option]:bg-night-900"
                            aria-invalid={!!errors.service}
                            aria-describedby={errors.service ? "service-erro" : undefined}
                            required
                          >
                            <option value="">Selecione...</option>
                            {state.services.map((sv) => (
                              <option key={sv.id} value={sv.title}>
                                {sv.title}
                              </option>
                            ))}
                            <option value="Outro">Outro</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden />
                        </div>
                      </Field>
                      <Field label="Assunto" htmlFor="subject" error={errors.subject}>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={data.subject}
                          onChange={(e) => set("subject", e.target.value)}
                          className="input-dark"
                          placeholder="Ex.: Sistema de pedidos"
                          aria-invalid={!!errors.subject}
                          aria-describedby={errors.subject ? "subject-erro" : undefined}
                          required
                        />
                      </Field>
                    </div>
                    <Field label="Descrição da necessidade ou projeto" htmlFor="message" error={errors.message}>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={data.message}
                        onChange={(e) => set("message", e.target.value)}
                        className="input-dark resize-y"
                        placeholder="Descreva o cenário atual, o que você precisa resolver, prazos e qualquer informação relevante."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-erro" : undefined}
                        required
                      />
                    </Field>

                    {/* Honeypot */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <label htmlFor="website">Não preencha este campo</label>
                      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
                    </div>

                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
                        <input
                          type="checkbox"
                          checked={data.consent}
                          onChange={(e) => set("consent", e.target.checked)}
                          className="mt-0.5 size-4 shrink-0 accent-electric-500"
                          aria-invalid={!!errors.consent}
                          aria-describedby={errors.consent ? "consent-erro" : undefined}
                        />
                        <span>
                          Autorizo o uso dos meus dados para retorno desta solicitação, conforme a{" "}
                          <Link to="/privacidade" className="text-cyan-300 underline underline-offset-2">
                            Política de Privacidade
                          </Link>{" "}
                          (LGPD).
                        </span>
                      </label>
                      {errors.consent && (
                        <p id="consent-erro" role="alert" className="mt-1.5 text-xs text-red-300">
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    {status === "error" && (
                      <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                        Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.
                      </p>
                    )}

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                      <Button type="submit" size="lg" disabled={status === "sending"} icon={status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}>
                        {status === "sending" ? "Enviando..." : "Enviar solicitação"}
                      </Button>
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <ShieldCheck className="size-4 text-emerald-400" /> Seus dados são protegidos e não são compartilhados.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Informações */}
            <div className="space-y-5 lg:col-span-5">
              <Reveal delay={100}>
                <a
                  href={whatsappLink(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6 transition hover:border-emerald-400/50 hover:bg-emerald-400/10"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,.8)]">
                    <WhatsappIcon width={26} height={26} />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-white">Atendimento pelo WhatsApp</p>
                    <p className="text-sm text-slate-400">Resposta rápida em horário comercial</p>
                  </div>
                </a>
              </Reveal>

              <Reveal delay={160}>
                <div className="rounded-3xl border border-white/8 bg-night-900/60 p-7">
                  <h2 className="text-lg font-semibold text-white">Canais de contato</h2>
                  <ul className="mt-5 space-y-4 text-sm">
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                      <div>
                        <p className="text-slate-500">E-mail institucional</p>
                        <a href={`mailto:${s.email}`} className="break-all text-white hover:text-cyan-300">
                          {s.email}
                        </a>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                      <div>
                        <p className="text-slate-500">Telefone</p>
                        <a href={`tel:${s.phone.replace(/\D/g, "")}`} className="text-white hover:text-cyan-300">
                          {s.phone}
                        </a>
                      </div>
                    </li>
                    {(s.address || s.city) && (
                      <li className="flex gap-3">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                        <div>
                          <p className="text-slate-500">Localização</p>
                          <p className="text-white">
                            {s.address}
                            {s.address && s.city ? ", " : ""}
                            {s.city}
                          </p>
                        </div>
                      </li>
                    )}
                    {s.businessHours && (
                      <li className="flex gap-3">
                        <Clock className="mt-0.5 size-4 shrink-0 text-cyan-400" />
                        <div>
                          <p className="text-slate-500">Horário de atendimento</p>
                          <p className="text-white">{s.businessHours}</p>
                        </div>
                      </li>
                    )}
                  </ul>
                  {socials.length > 0 && (
                    <div className="mt-6 border-t border-white/5 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Redes sociais</p>
                      <ul className="mt-3 flex gap-2">
                        {socials.map(({ href, icon: Icon, label }) => (
                          <li key={label}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={label}
                              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-electric-400/50 hover:text-white"
                            >
                              <Icon />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Reveal>

              {s.mapUrl && (
                <Reveal delay={220}>
                  <div className={cn("overflow-hidden rounded-3xl border border-white/8")}>
                    <iframe
                      src={s.mapUrl}
                      title="Localização da Khronos Tecnologia e Sistemas"
                      className="h-64 w-full grayscale-[40%] contrast-[1.05]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
