# Chá de Panela — Edu & Raquel

Aplicação web para convite de Chá de Panela com lista de presentes.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase** (Postgres + RLS)
- **Framer Motion**
- **Vercel** (deploy)

## Funcionalidades

### Área Pública
- Boas-vindas com informações do evento
- Coleta de nome do convidado (persistido em localStorage)
- RSVP (confirmação de presença)
- Lista de presentes com reservas e contribuições
- Instruções de entrega após reserva/contribuição

### Área Admin
- Login protegido por passcode
- Dashboard com estatísticas
- CRUD completo de itens de presente
- Visualização de RSVPs
- Moderação (cancelar reservas, deletar contribuições)

## Setup

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (crie `.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSCODE=um_codigo_forte
ADMIN_COOKIE_SECRET=uma_string_longa_e_aleatoria
```

4. Execute o SQL do banco de dados no Supabase (veja `docs/README.md`)

5. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
app/
  page.tsx                    # Homepage pública
  presentes/page.tsx          # Lista de presentes
  admin/                      # Área administrativa
    login/page.tsx
    page.tsx                  # Dashboard
    itens/page.tsx            # CRUD itens
    rsvp/page.tsx             # Lista RSVP
  api/admin/                  # APIs admin
components/                   # Componentes React
lib/
  supabase/                   # Clientes Supabase
  admin/                      # Autenticação admin
```

## Deploy

O projeto está configurado para deploy no Vercel. Configure as mesmas variáveis de ambiente no painel do Vercel.

## Observações

- Data/hora/endereço do evento podem ficar como null (placeholders)
- Imagens do casal serão substituídas pela arte final
- QR PIX é opcional
- Pagamentos PIX são feitos fora do site; o site apenas registra a intenção
