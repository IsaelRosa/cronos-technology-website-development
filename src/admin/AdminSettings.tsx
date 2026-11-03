import { useRef, useState } from "react";
import { Download, KeyRound, RotateCcw, Save, Upload } from "lucide-react";
import type { FormProvider, Settings } from "@/types";
import { useCms } from "@/store/cms";
import { downloadText } from "@/lib/utils";
import { AdminButton, AdminCard, AdminHeader, ConfirmDialog, FieldWrap, Input, Select, Textarea, useToast } from "./fields";

export default function AdminSettings() {
  const { state, updateSettings, changePassword, exportJson, importJson, resetAll } = useCms();
  const { toast, show } = useToast();
  const [form, setForm] = useState<Settings>(state.settings);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));
  const setSocial = (k: keyof Settings["social"], v: string) => setForm((f) => ({ ...f, social: { ...f.social, [k]: v } }));
  const setStat = (i: number, k: "value" | "label", v: string) =>
    setForm((f) => ({ ...f, stats: f.stats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));

  const save = () => {
    updateSettings({ ...form, whatsapp: form.whatsapp.replace(/\D/g, "") });
    show("Configurações salvas.");
  };

  const savePassword = async () => {
    if (pw.next.length < 6) return show("A nova senha deve ter pelo menos 6 caracteres.", "err");
    if (pw.next !== pw.confirm) return show("A confirmação não confere.", "err");
    const ok = await changePassword(pw.current, pw.next);
    if (!ok) return show("Senha atual incorreta.", "err");
    setPw({ current: "", next: "", confirm: "" });
    show("Senha alterada com sucesso.");
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    if (importJson(text)) {
      show("Backup restaurado. Recarregue a página para ver as alterações nas configurações.");
    } else show("Arquivo de backup inválido.", "err");
  };

  return (
    <>
      <AdminHeader
        title="Configurações"
        description="Informações institucionais, integrações e segurança."
        actions={
          <AdminButton onClick={save} icon={<Save className="size-4" />}>
            Salvar alterações
          </AdminButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminCard title="Informações institucionais" description="Exibidas no rodapé, página de contato e metadados.">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldWrap label="Nome da empresa" className="sm:col-span-2">
              <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Frase institucional" className="sm:col-span-2">
              <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Texto de apresentação" className="sm:col-span-2">
              <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="E-mail institucional">
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Telefone (exibição)">
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="WhatsApp (somente números, com DDI)" hint="Ex.: 5511999990000">
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Horário de atendimento">
              <Input value={form.businessHours} onChange={(e) => set("businessHours", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Mensagem padrão do WhatsApp" className="sm:col-span-2">
              <Input value={form.whatsappMessage} onChange={(e) => set("whatsappMessage", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Endereço">
              <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Cidade / UF">
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Mapa (URL de incorporação do Google Maps)" className="sm:col-span-2" hint="Google Maps → Compartilhar → Incorporar um mapa → copie apenas o endereço do atributo src.">
              <Input value={form.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
            </FieldWrap>
            <FieldWrap label="URL do site (domínio próprio)" className="sm:col-span-2">
              <Input value={form.siteUrl} onChange={(e) => set("siteUrl", e.target.value)} />
            </FieldWrap>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Redes sociais" description="Deixe em branco para ocultar.">
            <div className="grid gap-4 sm:grid-cols-2">
              {(["instagram", "linkedin", "facebook", "youtube", "github"] as const).map((k) => (
                <FieldWrap key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
                  <Input value={form.social[k]} onChange={(e) => setSocial(k, e.target.value)} placeholder="https://" />
                </FieldWrap>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Indicadores em destaque" description="Números exibidos na página inicial e em Sobre.">
            <div className="grid gap-3">
              {form.stats.map((s, i) => (
                <div key={i} className="grid grid-cols-[110px_1fr] gap-2">
                  <Input value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} aria-label={`Valor ${i + 1}`} />
                  <Input value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} aria-label={`Descrição ${i + 1}`} />
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <AdminCard title="Envio do formulário por e-mail" description="Integração real para receber as solicitações no e-mail institucional. As mensagens também ficam salvas no painel.">
          <div className="space-y-4">
            <FieldWrap label="Provedor de envio">
              <Select value={form.formProvider} onChange={(e) => set("formProvider", e.target.value as FormProvider)}>
                <option value="none">Não configurado (apenas registrar no painel)</option>
                <option value="formspree">Formspree (gratuito, sem servidor)</option>
                <option value="web3forms">Web3Forms (gratuito, sem servidor)</option>
                <option value="custom">Endpoint próprio (API / webhook)</option>
              </Select>
            </FieldWrap>
            {form.formProvider === "formspree" && (
              <FieldWrap label="ID do formulário Formspree" hint="Crie um formulário em formspree.io apontando para o e-mail institucional e cole o ID (ex.: xqkrzabc).">
                <Input value={form.formspreeId} onChange={(e) => set("formspreeId", e.target.value.trim())} placeholder="xqkrzabc" />
              </FieldWrap>
            )}
            {form.formProvider === "web3forms" && (
              <FieldWrap label="Access key do Web3Forms" hint="Gere uma chave gratuita em web3forms.com com o e-mail institucional.">
                <Input value={form.web3formsKey} onChange={(e) => set("web3formsKey", e.target.value.trim())} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
              </FieldWrap>
            )}
            {form.formProvider === "custom" && (
              <FieldWrap label="URL do endpoint (POST JSON)" hint="Recebe os campos: nome, empresa, email, telefone, servico, assunto, mensagem.">
                <Input value={form.customEndpoint} onChange={(e) => set("customEndpoint", e.target.value.trim())} placeholder="https://api.suaempresa.com.br/contato" />
              </FieldWrap>
            )}
            <FieldWrap label="Google Analytics (ID de medição)" hint="Ex.: G-XXXXXXXXXX. Carregado somente após o consentimento de cookies (LGPD).">
              <Input value={form.analyticsId} onChange={(e) => set("analyticsId", e.target.value.trim())} placeholder="G-XXXXXXXXXX" />
            </FieldWrap>
          </div>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard title="Segurança" description="Altere a senha de acesso ao painel.">
            <div className="grid gap-4">
              <FieldWrap label="Senha atual">
                <Input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
              </FieldWrap>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrap label="Nova senha">
                  <Input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
                </FieldWrap>
                <FieldWrap label="Confirmar nova senha">
                  <Input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
                </FieldWrap>
              </div>
              <AdminButton variant="outline" onClick={savePassword} icon={<KeyRound className="size-4" />} className="w-fit">
                Alterar senha
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Backup e restauração" description="Os conteúdos ficam salvos neste navegador. Exporte um backup para migrar ou proteger os dados.">
            <div className="flex flex-wrap gap-2">
              <AdminButton variant="outline" onClick={() => downloadText(`cronos-backup-${new Date().toISOString().slice(0, 10)}.json`, exportJson())} icon={<Download className="size-4" />}>
                Exportar backup
              </AdminButton>
              <AdminButton variant="outline" onClick={() => fileRef.current?.click()} icon={<Upload className="size-4" />}>
                Importar backup
              </AdminButton>
              <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
              <AdminButton variant="danger" onClick={() => setConfirmReset(true)} icon={<RotateCcw className="size-4" />}>
                Restaurar padrão
              </AdminButton>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <AdminButton onClick={save} icon={<Save className="size-4" />}>
          Salvar alterações
        </AdminButton>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Restaurar conteúdo padrão"
        text="Todos os projetos, serviços, artigos, mensagens e configurações serão substituídos pelo conteúdo inicial. Exporte um backup antes, se necessário."
        confirmLabel="Restaurar"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAll();
          setConfirmReset(false);
          show("Conteúdo padrão restaurado. Recarregue a página.");
        }}
      />
      {toast}
    </>
  );
}
