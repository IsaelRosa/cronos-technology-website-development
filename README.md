# Cronos Tecnologia e Sistemas — Site institucional

Site institucional completo (React + Vite + Tailwind CSS v4) com portfólio dinâmico, blog, formulário de orçamento com envio real por e-mail e painel administrativo.

## Scripts

```bash
npm install      # instala dependências
npm run dev      # ambiente de desenvolvimento
npm run build    # gera dist/index.html (arquivo único, pronto para hospedar)
```

## Painel administrativo

- Acesse `/#/admin` (link "Área administrativa" no rodapé).
- Senha inicial: `cronos2024` — altere em **Configurações → Segurança**.
- Gerencie: projetos do portfólio (imagens, vídeos, links, categorias), serviços, artigos do blog, mensagens recebidas e informações institucionais (e-mail, WhatsApp, endereço, redes sociais, indicadores, Google Analytics).
- Os conteúdos ficam salvos no navegador (`localStorage`). Use **Configurações → Backup** para exportar/importar um arquivo JSON e levar o conteúdo para outro computador/servidor.

> Para operação multiusuário em produção, o mesmo modelo de dados (`src/types.ts`) pode ser conectado a um backend/CMS (ex.: Supabase, Firebase ou API própria) substituindo a camada `src/store/cms.tsx`.

## Envio do formulário para o e-mail institucional

Em **Configurações → Envio do formulário por e-mail**, escolha um provedor:

| Provedor | Como configurar |
| --- | --- |
| **Formspree** | Crie um formulário em formspree.io apontando para o e-mail institucional e informe o ID (ex.: `xqkrzabc`). |
| **Web3Forms** | Gere uma *access key* gratuita em web3forms.com com o e-mail institucional. |
| **Endpoint próprio** | URL que recebe `POST` JSON com `nome, empresa, email, telefone, servico, assunto, mensagem`. |

Independentemente do provedor, todas as mensagens ficam registradas em **Mensagens** no painel.

## SEO, Analytics e LGPD

- Metadados, Open Graph e dados estruturados (JSON-LD) em `index.html`; títulos/descrições por página via `useSEO`.
- Google Analytics: informe o ID de medição (`G-XXXXXXXX`) no painel. O script só carrega após o consentimento de cookies.
- Banner de consentimento, Política de Privacidade (`/#/privacidade`) e checkbox de consentimento no formulário.

## Hospedagem com domínio próprio

O build gera um único `dist/index.html` com todos os recursos embutidos — basta publicá-lo em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, cPanel, S3...). Para URLs sem `#` (ex.: `/portfolio`), troque `HashRouter` por `BrowserRouter` em `src/App.tsx` e habilite o *fallback* para `index.html` no servidor.
