# ⚡ Canaã Fibra — Dashboard Operacional

Portal de inteligência operacional para análise de novos clientes pós-instalação.

Projetado por **João Vitor**.

---

## 📊 O que o dashboard mostra

- **KPIs executivos** — instalados, chamados, O.S, receita, custo, margem
- **Funil da jornada** — do momento da instalação até o suporte
- **Mapa de causas** — categorização dos chamados de suporte
- **Chamados por app/streaming** — HBO Max, Canaã TV, Kaspersky, etc.
- **Volume semanal** — chamados e O.S por semana do mês
- **O.S campo vs administrativas** — composição e custo
- **FCR (First Call Resolution)** — gauge com metas
- **Demonstrativo financeiro (DRE)** — receita, custos linha a linha, margem
- **Comparativo Jan × Fev** — lado a lado
- **Mix de planos** — distribuição por velocidade
- **Distribuição de custo por cliente** — faixas reais por login
- **Ranking de atendentes** — volume + FCR individual
- **Projeção de cenários** — base, otimista e pessimista

**Dados reais:** Janeiro e Fevereiro de 2026 · Toggle mensal interativo.

---

## 🚀 Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- npm v9 ou superior

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/canaa-dashboard.git
cd canaa-dashboard

# 2. Instale as dependências
npm install

# 3. Rode em modo desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

### Build para produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/` — prontos para deploy em qualquer hosting estático (Netlify, Vercel, GitHub Pages, etc.).

---

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| [React 18](https://react.dev/) | Interface |
| [Vite 5](https://vitejs.dev/) | Bundler / dev server |
| [Recharts](https://recharts.org/) | Gráficos |
| DM Sans (Google Fonts) | Tipografia |

---

## 📁 Estrutura do projeto

```
canaa-dashboard/
├── index.html          # Entry point HTML
├── vite.config.js      # Config do Vite
├── package.json
├── .gitignore
└── src/
    ├── main.jsx        # Monta o React na página
    ├── index.css       # Reset global
    └── App.jsx         # Dashboard completo (componente principal)
```

---

## 💰 Premissas de custo

| Item | Custo unitário |
|---|---|
| Atendimento de suporte | R$ 12,00 |
| Ordem de Serviço — campo | R$ 85,00 |
| Ordem de Serviço — administrativa | R$ 8,00 |

---

*Dados reais de Jan/Fev 2026 — CANAA SERVICOS DE TELECOMUNICACAO LTDA*
