import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, FunnelChart, Funnel, LabelList
} from "recharts";

// ─── DESIGN TOKENS — LIGHT THEME ─────────────────────────────────────────────
const T = {
  bg:       "#f0f2f7",
  surface:  "#e8ebf2",
  card:     "#ffffff",
  border:   "#dde2ee",
  borderL:  "#c8d0e0",
  accent:   "#2563eb",
  accentD:  "#1d4ed8",
  green:    "#059669",
  red:      "#dc2626",
  amber:    "#d97706",
  purple:   "#7c3aed",
  teal:     "#0891b2",
  text:     "#0f172a",
  text2:    "#475569",
  text3:    "#94a3b8",
  shadow:   "0 1px 3px rgba(15,23,42,.06), 0 4px 16px rgba(15,23,42,.08)",
  shadowHov:"0 4px 12px rgba(15,23,42,.10), 0 12px 32px rgba(15,23,42,.12)",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DATA = {
  jan: {
    label: "Janeiro 2026",
    installed: 520, contacted: 501, tickets: 976, os: 553,
    osCampo: 444, osAdmin: 109, cancels: 3,
    revenue: 67147.79, cost: 50324, margin: 16823.79,
    ticket: 129.13, fcr: 56.6, score: 42,
    // Semanas: chamados via coluna 'Criado em'; OS via coluna 'Data reservada'
    weekly: [
      { w: "S1 (1–7)",   chamados: 157, os: 78  },
      { w: "S2 (8–14)",  chamados: 224, os: 110 },
      { w: "S3 (15–21)", chamados: 253, os: 100 },
      { w: "S4 (22–28)", chamados: 261, os: 123 },
      { w: "S5 (29–31)", chamados: 81,  os: 54  },
    ],
    // Causas: total 976 chamados — validado nos arquivos fonte
    causas: [
      { name: "Onboarding",  value: 601, fill: "#3b82f6" },
      { name: "Aplicativos", value: 137, fill: "#8b5cf6" },
      { name: "Equipamento", value: 84,  fill: "#06b6d4" },
      { name: "Técnico",     value: 80,  fill: "#ef4444" },
      { name: "Financeiro",  value: 37,  fill: "#f59e0b" },
      { name: "Outros",      value: 37,  fill: "#475569" },
    ],
    apps: [
      { name: "HBO Max",        v: 110 },
      { name: "Canaã TV",       v: 106 },
      { name: "Paramount",      v: 106 },
      { name: "Kaspersky",      v: 106 },
      { name: "Playhub/Ubook",  v: 106 },
      { name: "Watch",          v: 6   },
      { name: "Mediquo",        v: 3   },
    ],
    planos: [
      { name: "500 MB", qtd: 342, rec: 39690, fill: "#3b82f6" },
      { name: "700 MB", qtd: 99,  rec: 13330, fill: "#8b5cf6" },
      { name: "900 MB", qtd: 57,  rec: 9130,  fill: "#06b6d4" },
      { name: "1 Giga", qtd: 19,  rec: 3988,  fill: "#10b981" },
      { name: "Outros", qtd: 3,   rec: 1010,  fill: "#475569" },
    ],
    distCusto: [
      { faixa: "R$0–50",    n: 120, fill: "#10b981" },
      { faixa: "R$51–100",  n: 181, fill: "#3b82f6" },
      { faixa: "R$101–150", n: 169, fill: "#f59e0b" },
      { faixa: "R$151–200", n: 24,  fill: "#f97316" },
      { faixa: "R$201–300", n: 21,  fill: "#ef4444" },
      { faixa: "R$301–500", n: 4,   fill: "#991b1b" },
    ],
    agents: [
      { name: "Tayane Ribeiro",        total: 139, fcr: 28.1 },
      { name: "Nathalia Melo",         total: 128, fcr: 21.1 },
      { name: "Thiago H. Novaes",      total: 120, fcr: 30.8 },
      { name: "Ana Carolina Miranda",  total: 103, fcr: 30.1 },
      { name: "Sebastião Tavares Jr.", total: 77,  fcr: 19.5 },
      { name: "Priscilla Rodrigues",   total: 70,  fcr: 98.6 },
      { name: "Lays Dos Reis Sales",   total: 52,  fcr: 100  },
      { name: "Walison Rodrigues",     total: 44,  fcr: 100  },
    ],
  },
  fev: {
    label: "Fevereiro 2026",
    installed: 409, contacted: 394, tickets: 773, os: 2106,
    osCampo: 833, osAdmin: 1273, cancels: 7,
    revenue: 49432.50, cost: 90265, margin: -40832.50,
    ticket: 120.86, fcr: 49.3, score: 36,
    // Semanas: OS explodiram por volume de conformidade/contratos
    weekly: [
      { w: "S1 (1–7)",   chamados: 203, os: 318 },
      { w: "S2 (8–14)",  chamados: 177, os: 319 },
      { w: "S3 (15–21)", chamados: 189, os: 271 },
      { w: "S4 (22–28)", chamados: 204, os: 250 },
    ],
    // Causas: total 773 chamados — validado nos arquivos fonte
    causas: [
      { name: "Onboarding",  value: 460, fill: "#3b82f6" },
      { name: "Aplicativos", value: 88,  fill: "#8b5cf6" },
      { name: "Técnico",     value: 79,  fill: "#ef4444" },
      { name: "Equipamento", value: 61,  fill: "#06b6d4" },
      { name: "Outros",      value: 45,  fill: "#475569" },
      { name: "Financeiro",  value: 40,  fill: "#f59e0b" },
    ],
    apps: [
      { name: "Canaã TV",       v: 76 },
      { name: "HBO Max",        v: 76 },
      { name: "Kaspersky",      v: 76 },
      { name: "Playhub/Ubook",  v: 75 },
      { name: "Paramount",      v: 74 },
      { name: "Watch",          v: 6  },
      { name: "Mediquo",        v: 5  },
    ],
    planos: [
      { name: "500 MB", qtd: 253, rec: 26260, fill: "#3b82f6" },
      { name: "700 MB", qtd: 91,  rec: 12200, fill: "#8b5cf6" },
      { name: "900 MB", qtd: 46,  rec: 7104,  fill: "#06b6d4" },
      { name: "1 Giga", qtd: 19,  rec: 3868,  fill: "#10b981" },
    ],
    distCusto: [
      { faixa: "R$0–50",    n: 4,   fill: "#10b981" },
      { faixa: "R$51–100",  n: 0,   fill: "#3b82f6" },
      { faixa: "R$101–150", n: 114, fill: "#f59e0b" },
      { faixa: "R$151–200", n: 9,   fill: "#f97316" },
      { faixa: "R$201–300", n: 197, fill: "#ef4444" },
      { faixa: "R$301–500", n: 72,  fill: "#991b1b" },
      { faixa: "R$500+",    n: 11,  fill: "#450a0a" },
    ],
    agents: [
      { name: "Ana Carolina Miranda",  total: 105, fcr: 20.0 },
      { name: "Nathalia Melo",         total: 94,  fcr: 12.8 },
      { name: "Thiago H. Novaes",      total: 91,  fcr: 13.2 },
      { name: "Tayane Ribeiro",        total: 76,  fcr: 14.5 },
      { name: "Sebastião Tavares Jr.", total: 58,  fcr: 10.3 },
      { name: "Livia Reis",            total: 42,  fcr: 92.9 },
      { name: "Caique Abreu",          total: 41,  fcr: 92.7 },
      { name: "Walison Rodrigues",     total: 34,  fcr: 97.1 },
    ],
  },
};

// ─── COMPARATIVO JAN×FEV ──────────────────────────────────────────────────────
const COMPARE = [
  { name: "Receita",   jan: 67148, fev: 49433 },
  { name: "Custo",     jan: 50324, fev: 90265 },
  { name: "Margem",    jan: 16824, fev: -40833 },
];
const COMPARE_OS = [
  { name: "Janeiro", campo: 444,  admin: 109  },
  { name: "Fev",     campo: 833,  admin: 1273 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (v, d=0) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const brl = (v, d=0) => "R$ " + fmt(v, d);

// Animated number counter hook
function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(target * ease);
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [target]);
  return val;
}

// Animated KPI value
function AnimVal({ raw, prefix = "", suffix = "", decimals = 0 }) {
  const animated = useCountUp(parseFloat(String(raw).replace(/[^\d.-]/g, "")) || 0);
  const formatted = fmt(animated, decimals);
  return <span>{prefix}{formatted}{suffix}</span>;
}

// Scroll fade-in hook
function useFadeIn(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

// FadeSection wrapper
function FadeSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const vis = useFadeIn(ref);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
    }}>{children}</div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function Stat({ label, value, sub, color = T.accent, icon, badge, badgeColor }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.card,
        border: `1.5px solid ${hov ? color : T.border}`,
        borderRadius: 14,
        padding: "18px 18px 14px",
        position: "relative", overflow: "hidden",
        boxShadow: hov ? `0 8px 24px ${color}22, ${T.shadowHov}` : T.shadow,
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
        cursor: "default",
      }}>
      {/* left accent bar */}
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3,
        background: hov ? color : `linear-gradient(180deg,${color}66,transparent)`,
        transition:"all .22s ease" }}/>
      {/* shimmer on hover */}
      {hov && <div style={{ position:"absolute", inset:0,
        background:`radial-gradient(circle at 20% 50%, ${color}08, transparent 70%)`,
        pointerEvents:"none" }}/>}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10, paddingLeft:8 }}>
        <div style={{ width:34, height:34, borderRadius:9, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:17,
          background: hov ? `${color}18` : `${color}0d`,
          transition:"background .2s", border:`1px solid ${color}20` }}>
          {icon}
        </div>
        {badge && (
          <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 7px", borderRadius:20,
            background: (badgeColor || color)+"18",
            color: badgeColor || color, fontFamily:"monospace", letterSpacing:.3,
            border:`1px solid ${(badgeColor||color)}30` }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ paddingLeft:8 }}>
        <div style={{ fontSize:22, fontWeight:800, color: T.text, letterSpacing:"-0.5px", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:11, fontWeight:600, color: T.text2, marginTop:5, textTransform:"uppercase", letterSpacing:".5px" }}>{label}</div>
        {sub && <div style={{ fontSize:10.5, color: T.text3, marginTop:3, lineHeight:1.4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function Card({ title, sub, children, accent, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.card,
        border: `1.5px solid ${hov && accent ? accent+"55" : T.border}`,
        borderRadius:14,
        overflow:"hidden",
        boxShadow: hov ? T.shadowHov : T.shadow,
        transition:"all .2s ease",
        ...style
      }}>
      {title && (
        <div style={{ padding:"14px 20px 10px", borderBottom:`1px solid ${T.border}`,
          background: hov ? "#fafbff" : T.card, transition:"background .2s" }}>
          {accent && <div style={{ height:2.5, background:`linear-gradient(90deg,${accent},${accent}44,transparent)`,
            marginBottom:10, borderRadius:2, width: hov ? "100%" : "60%", transition:"width .4s ease" }}/>}
          <div style={{ fontSize:13.5, fontWeight:700, color:T.text }}>{title}</div>
          {sub && <div style={{ fontSize:11, color:T.text3, marginTop:3, lineHeight:1.4 }}>{sub}</div>}
        </div>
      )}
      <div style={{ padding:"14px 20px 18px" }}>{children}</div>
    </div>
  );
}

function Insight({ text }) {
  return (
    <div style={{
      background: `${T.accent}08`, border:`1px solid ${T.accent}22`,
      borderLeft:`3px solid ${T.accent}`, borderRadius:7,
      padding:"8px 12px", fontSize:11.5, color:T.text2,
      lineHeight:1.55, marginBottom:12
    }} dangerouslySetInnerHTML={{ __html: "💡 " + text }} />
  );
}

function ProgressBar({ value, max, color = T.accent, label, labelRight, height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {(label || labelRight) && (
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          {label && <span style={{ fontSize:11.5, color:T.text2, fontWeight:500 }}>{label}</span>}
          {labelRight && <span style={{ fontSize:11, fontFamily:"monospace", color:T.text2, fontWeight:600 }}>{labelRight}</span>}
        </div>
      )}
      <div style={{ height, background:T.border, borderRadius:height/2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`,
          background:`linear-gradient(90deg,${color},${color}cc)`,
          borderRadius:height/2, transition:"width 1.1s cubic-bezier(.4,0,.2,1)",
          boxShadow:`0 0 6px ${color}55` }} />
      </div>
    </div>
  );
}

function Badge({ children, color = T.accent }) {
  return (
    <span style={{ fontSize:9.5, fontWeight:700, padding:"2px 8px", borderRadius:20,
      background: color + "14", color, letterSpacing:.4,
      border:`1px solid ${color}28` }}>
      {children}
    </span>
  );
}

function SectionHeader({ n, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"28px 0 16px" }}>
      <span style={{ fontSize:10, fontFamily:"monospace", color:T.accent, fontWeight:700,
        background:`${T.accent}12`, padding:"1px 6px", borderRadius:4, flexShrink:0 }}>{n}</span>
      <span style={{ fontSize:10.5, fontWeight:800, letterSpacing:"0.9px", textTransform:"uppercase",
        color:T.text2, whiteSpace:"nowrap" }}>{title}</span>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${T.border},transparent)` }}/>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { background:"#ffffff", border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:12,
    boxShadow:"0 8px 24px rgba(15,23,42,.12)", padding:"8px 12px" },
  labelStyle:   { color: T.text, fontWeight: 700, marginBottom:4 },
  itemStyle:    { color: T.text2 },
  cursor:       { fill:"rgba(37,99,235,.04)" },
};

// ─── FCR GAUGE ────────────────────────────────────────────────────────────────
function FCRGauge({ value }) {
  const pct = value / 100;
  const r = 54, cx = 70, cy = 70;
  const circumference = Math.PI * r; // half circle
  const dash = pct * circumference;
  const color = value >= 70 ? T.green : value >= 50 ? T.amber : T.red;
  return (
    <div style={{ textAlign:"center" }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke={T.border} strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition:"stroke-dasharray 1.2s ease" }} />
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="22" fontWeight="800" fill={T.text}>{value}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="9" fontWeight="600" fill={T.text3} letterSpacing="1">FCR</text>
      </svg>
    </div>
  );
}

// ─── FUNNEL ────────────────────────────────────────────────────────────────────
function CustomerFunnel({ d }) {
  const steps = [
    { label:"Instalados",        n: d.installed,  color:"#3b82f6" },
    { label:"Contataram Suporte",n: d.contacted,  color:"#f97316" },
    { label:"Geraram O.S",       n: d.os,         color:"#8b5cf6" },
    { label:"Cancelamentos",     n: d.cancels,    color:"#ef4444" },
  ];
  const max = steps[0].n;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {steps.map((s, i) => {
        const pct = (s.n / max * 100).toFixed(1);
        return (
          <div key={i}>
            {i > 0 && <div style={{ textAlign:"center", color:T.text3, fontSize:12, margin:"2px 0" }}>↓</div>}
            <div style={{ display:"grid", gridTemplateColumns:"160px 1fr 64px", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:12, fontWeight:500, color:T.text2 }}>{s.label}</span>
              <div style={{ height:26, background:T.bg, borderRadius:5, overflow:"hidden", position:"relative", border:`1px solid ${T.border}` }}>
                <div style={{ height:"100%", width:`${pct}%`, background:s.color, borderRadius:5,
                  transition:"width 1s ease .3s", display:"flex", alignItems:"center", paddingLeft:8 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,.9)", whiteSpace:"nowrap" }}>{pct}%</span>
                </div>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:T.text, fontFamily:"monospace", textAlign:"right" }}>{fmt(s.n)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── AGENTS TABLE ──────────────────────────────────────────────────────────────
function AgentsTable({ agents }) {
  const fcrColor = (v) => v >= 80 ? T.green : v >= 50 ? T.amber : T.red;
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid ${T.border}` }}>
            {["Atendente","Chamados","Resolvidos","Taxa FCR","Status"].map(h => (
              <th key={h} style={{ padding:"8px 12px", fontSize:10, fontWeight:700, color:T.text3,
                textAlign: h === "Atendente" ? "left" : "right",
                textTransform:"uppercase", letterSpacing:".6px", background:"#f8f9fc" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agents.map((a, i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, transition:'background .12s', cursor:'default' }} onMouseEnter={e=>e.currentTarget.style.background='#f5f7ff'} onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{ padding:"9px 12px", fontSize:12.5, fontWeight:600, color:T.text }}>{a.name}</td>
              <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"monospace", fontSize:12, color:T.text2 }}>{a.total}</td>
              <td style={{ padding:"9px 12px", textAlign:"right", fontFamily:"monospace", fontSize:12, color:T.text2 }}>
                {Math.round(a.total * a.fcr / 100)}
              </td>
              <td style={{ padding:"9px 12px", textAlign:"right" }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:60, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${a.fcr}%`, background:fcrColor(a.fcr), borderRadius:2 }} />
                  </div>
                  <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:fcrColor(a.fcr) }}>
                    {a.fcr}%
                  </span>
                </div>
              </td>
              <td style={{ padding:"9px 12px", textAlign:"right" }}>
                <Badge color={fcrColor(a.fcr)}>
                  {a.fcr >= 80 ? "✓ Alto" : a.fcr >= 50 ? "△ Médio" : "⚠ Baixo"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mes, setMes] = useState("jan");
  const [activeSection, setActiveSection] = useState("kpis");
  const d = DATA[mes];

  // Map nav items to section IDs
  const NAV_MAP = {
    "Visão Geral":        "kpis",
    "Novos Clientes":     "jornada",
    "Atendimento":        "atendimento",
    "Ordens de Serviço":  "ordens",
    "Aplicativos":        "aplicativos",
    "Experiência":        "ordens",
    "Impacto Financeiro": "financeiro",
    "Comparativo":        "comparativo",
    "Plano de Ação":      "cenarios",
  };

  const scrollTo = (sectionId) => {
    const root = mainRef.current;
    if (!root) return;
    const el = root.querySelector("#" + sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  const mainRef = useRef(null);
  useEffect(() => {
    const ids = ["kpis","jornada","aplicativos","atendimento","ordens","financeiro","comparativo","planos","agentes","cenarios"];
    const root = mainRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { root, rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );
    ids.forEach(id => { const el = root.querySelector("#"+id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const margin = d.revenue - d.cost;
  const marginPct = (margin / d.revenue * 100);
  const costPct = (d.cost / d.revenue * 100);
  const be = (d.cost / d.revenue);
  const pctContact = (d.contacted / d.installed * 100);
  const costPerClient = d.cost / d.installed;

  // Score color
  const scoreColor = d.score >= 60 ? T.green : d.score >= 45 ? T.amber : T.red;

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif", background:T.bg, minHeight:"100vh",
      color:T.text, display:"flex" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:220, background:T.surface, borderRight:`1px solid ${T.border}`,
        display:"flex", flexDirection:"column", position:"sticky", top:0,
        height:"100vh", overflowY:"auto", flexShrink:0,
      }}>
        {/* Brand */}
        <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
            <div style={{ width:34, height:34, background:`linear-gradient(135deg,${T.accent},${T.purple})`,
              borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, flexShrink:0 }}>⚡</div>
            <div>
              <div style={{ fontSize:13.5, fontWeight:800, color:T.text, letterSpacing:"-.2px" }}>Canaã Fibra</div>
              <div style={{ fontSize:10, color:T.text3, letterSpacing:".3px" }}>Projetado por João Vitor</div>
            </div>
          </div>
          {/* Month toggle */}
          <div style={{ display:"flex", background:T.bg, borderRadius:8, padding:3, gap:2 }}>
            {["jan","fev"].map(m => (
              <button key={m} onClick={() => setMes(m)} style={{
                flex:1, padding:"7px 0", textAlign:"center", fontSize:11.5, fontWeight:700,
                borderRadius:6, border:"none", cursor:"pointer", fontFamily:"inherit",
                background: mes === m ? `linear-gradient(135deg,${T.accent},${T.accentD})` : "transparent",
                color: mes === m ? "#fff" : T.text3,
                boxShadow: mes === m ? `0 2px 8px ${T.accent}44` : "none",
                transition:"all .15s",
              }}>
                {m === "jan" ? "Jan 2026" : "Fev 2026"}
              </button>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding:"12px 8px", flex:1 }}>
          {[
            { g:"Operação", items:[
              { icon:"📊", label:"Visão Geral",        id:"kpis"       },
              { icon:"👥", label:"Novos Clientes",     id:"jornada"    },
              { icon:"🎧", label:"Atendimento",        id:"atendimento"},
            ]},
            { g:"Análise", items:[
              { icon:"🔧", label:"Ordens de Serviço",  id:"ordens"     },
              { icon:"📱", label:"Aplicativos",        id:"aplicativos"},
              { icon:"⭐", label:"Experiência",        id:"ordens"     },
            ]},
            { g:"Financeiro", items:[
              { icon:"💰", label:"Impacto Financeiro", id:"financeiro" },
              { icon:"📈", label:"Comparativo",        id:"comparativo"},
              { icon:"🎯", label:"Plano de Ação",      id:"cenarios"   },
            ]},
          ].map(({ g, items }) => (
            <div key={g} style={{ marginBottom:20 }}>
              <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:"1.1px", textTransform:"uppercase",
                color:T.text3, padding:"0 8px", marginBottom:4 }}>{g}</div>
              {items.map(({ icon, label, id }) => {
                const isActive = activeSection === id;
                return (
                  <div key={label}
                    onClick={() => scrollTo(id)}
                    style={{
                      display:"flex", alignItems:"center", gap:9, padding:"7px 10px",
                      borderRadius:7, marginBottom:1, cursor:"pointer",
                      background: isActive ? T.accent+"22" : "transparent",
                      color: isActive ? "#93c5fd" : T.text3,
                      fontSize:12.5, fontWeight: isActive ? 600 : 500,
                      transition:"all .12s",
                      borderLeft: isActive ? `2px solid ${T.accent}` : "2px solid transparent",
                    }}>
                    <span style={{ width:26, height:26, borderRadius:6,
                      background: isActive ? T.accent+"33" : T.bg,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>{icon}</span>
                    {label}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Score */}
        <div style={{ padding:"14px 16px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:".8px", textTransform:"uppercase",
            color:T.text3, marginBottom:6 }}>Score Operacional</div>
          <div style={{ fontSize:28, fontWeight:900, color:T.text, lineHeight:1 }}>{d.score}<span style={{ fontSize:13, color:T.text3, fontWeight:400 }}>/100</span></div>
          <div style={{ fontSize:11, color:T.text3, margin:"3px 0 8px", lineHeight:1.4 }}>
            {d.score >= 60 ? "Operação saudável" : d.score >= 45 ? "Atenção necessária" : "⚠ Crítico"}
          </div>
          <div style={{ height:3, background:T.border, borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${d.score}%`, background:scoreColor, borderRadius:3,
              transition:"width 1.2s ease" }} />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main ref={mainRef} style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", overflowY:"auto", height:"100vh" }}>

        {/* Topbar */}
        <div style={{ background:'#ffffff', borderBottom:`1px solid ${T.border}`, height:54, boxShadow:'0 1px 0 #dde2ee',
          display:"flex", alignItems:"center", padding:"0 24px", position:"sticky", top:0, zIndex:30 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:12, color:T.text3 }}>Canaã Fibra</span>
            <span style={{ color:T.border }}>›</span>
            <span style={{ fontSize:14, fontWeight:700, color:T.text }}>Impacto Financeiro — {d.label}</span>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10 }}>
            {pctContact > 80 && (
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px",
                borderRadius:20, background: T.red+"22", border:`1px solid ${T.red}44`,
                fontSize:11.5, fontWeight:600, color:T.red }}>
                ⚠️ {fmt(pctContact,1)}% contataram suporte
              </div>
            )}
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px",
              background:T.bg, border:`1px solid ${T.border}`, borderRadius:20,
              fontSize:12, color:T.text2 }}>
              <div style={{ position:"relative", width:8, height:8 }}>
                <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:T.green, animation:"blink 2s ease infinite" }}/>
                <div style={{ position:"absolute", inset:-2, borderRadius:"50%", border:`1.5px solid ${T.green}`, animation:"pulseRing 2s ease infinite" }}/>
              </div>
              {d.label}
            </div>
          </div>
        </div>

        <div style={{ padding:"24px", flex:1 }}>

          {/* ── ALERT BANNER ── */}
          <div style={{
            display:"flex", alignItems:"flex-start", gap:12, padding:"13px 18px",
            borderRadius:12, border:`1.5px solid ${margin >= 0 ? T.green+"44" : T.red+"44"}`,
            background: margin >= 0 ? T.green+"0a" : T.red+"0a", boxShadow: T.shadow,
            marginBottom:20, animation:"fadeUp .3s ease",
          }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{margin >= 0 ? "✅" : "🚨"}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.text, lineHeight:1.4 }}>
                {margin >= 0
                  ? `${d.label}: margem positiva de ${brl(margin)} (${fmt(marginPct,1)}%)`
                  : `${d.label}: margem negativa de −${brl(Math.abs(margin))} (${fmt(marginPct,1)}%)`}
              </div>
              <div style={{ fontSize:12, color:T.text2, marginTop:3, lineHeight:1.5 }}>
                {margin >= 0
                  ? `Custo (${brl(d.cost)}) coberto pela receita (${brl(d.revenue)}). Custo médio/cliente: ${brl(costPerClient,2)}.`
                  : `Custo (${brl(d.cost)}) superou receita (${brl(d.revenue)}) em ${brl(Math.abs(margin))}. Custo/cliente = ${fmt(costPerClient/d.ticket,1)}× a mensalidade.`}
              </div>
            </div>
          </div>

          {/* Onboarding alert */}
          {pctContact > 80 && (
            <div style={{
              display:"flex", alignItems:"flex-start", gap:12, padding:"13px 18px",
              borderRadius:12, border:`1.5px solid ${T.amber+"44"}`,
              background: T.amber+"0a", marginBottom:20, boxShadow: T.shadow,
            }}>
              <span style={{ fontSize:18 }}>⚠️</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>Possível falha no onboarding</div>
                <div style={{ fontSize:12, color:T.text2, marginTop:3, lineHeight:1.5 }}>
                  {fmt(pctContact,1)}% dos novos clientes ({d.contacted} de {d.installed}) contataram o suporte após instalação — acima do limite de 80%. Indica ausência de orientação pós-instalação.
                </div>
              </div>
            </div>
          )}

          {/* ─── 01. KPIs ─── */}
          <div id="kpis" style={{ scrollMarginTop: 70 }} />
          <FadeSection>
          <SectionHeader n="01" title="Indicadores Executivos do Mês" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10, marginBottom:20 }}>
            <Stat icon="👥" label="Clientes Instalados" value={fmt(d.installed)}
              sub="Novos contratos ativados" color={T.accent} badge={d.label.split(" ")[0]} badgeColor={T.accent}/>
            <Stat icon="📞" label="Contataram Suporte" value={fmt(d.contacted)}
              sub={`${fmt(pctContact,1)}% dos instalados`} color={T.amber} badge={fmt(pctContact,1)+"%"} badgeColor={T.amber}/>
            <Stat icon="🎧" label="Atendimentos" value={fmt(d.tickets)}
              sub={`Média ${fmt(d.tickets/d.installed,1)}/cliente`} color={T.purple}
              badge={`FCR ${d.fcr}%`} badgeColor={T.purple}/>
            <Stat icon="🔧" label="Ordens de Serviço" value={fmt(d.os)}
              sub={`${d.osCampo} campo · ${d.osAdmin} admin`} color={T.teal}
              badge={`R$${fmt((d.osCampo*85+d.osAdmin*8)/1000,0)}k custo`} badgeColor={T.teal}/>
            <Stat icon="💰" label="Receita Gerada" value={brl(d.revenue)}
              sub={`Ticket médio ${brl(d.ticket,2)}`} color={T.green}
              badge={`${d.installed} clientes`} badgeColor={T.green}/>
            <Stat icon="📉" label="Custo Operacional" value={brl(d.cost)}
              sub={`${fmt(costPct,1)}% da receita`} color={T.red}
              badge={brl(costPerClient,2)+"/cli"} badgeColor={T.red}/>
            <Stat icon="⚖️" label="Margem Operacional"
              value={(margin>=0?"+":"")+brl(margin)}
              sub={`Break-even: ${fmt(be,2)}× receita`}
              color={margin>=0?T.green:T.red}
              badge={(marginPct>=0?"+":"")+fmt(marginPct,1)+"%"}
              badgeColor={margin>=0?T.green:T.red}/>
          </div>
          </FadeSection>

          {/* ─── 02. FUNIL + CAUSAS ─── */}
          <div id="jornada" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={80}>
          <SectionHeader n="02" title="Jornada do Cliente & Causas dos Chamados" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card title="Funil da Jornada — Novos Clientes" sub="Do momento da instalação até o suporte pós-venda" accent={T.accent}>
              <Insight text={`<strong>${fmt(pctContact,1)}% dos clientes instalados retornaram ao suporte</strong> — ${pctContact > 80 ? "acima do limite crítico de 80%." : "acima do benchmark de mercado (~60%)."}`}/>
              <CustomerFunnel d={d} />
            </Card>

            <Card title="Mapa de Causas dos Chamados" sub="Categorização por tipo de demanda — total de chamados de novos clientes" accent={T.purple}>
              <Insight text={mes==="jan"
                ? "<strong>Onboarding (61,6%) e Aplicativos (14,0%)</strong> são evitáveis com melhor orientação pós-instalação."
                : "<strong>Onboarding continua dominante (59,5%).</strong> Técnico subiu de 8,2%→10,2%. Apps caíram de 137→88 chamados."}/>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={d.causas} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={75} innerRadius={40}
                    label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                    labelLine={{ stroke: T.text3, strokeWidth: 1 }}>
                    {d.causas.map((e,i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(v, n) => [fmt(v) + " chamados", n]}/>
                  <Legend iconSize={9} iconType="circle" wrapperStyle={{ fontSize:11, color:T.text2 }}
                    formatter={(value, entry) => `${value} (${fmt(entry.payload.value)})`}/>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          </FadeSection>

          {/* ─── 03. APPS + SEMANAL ─── */}
          <div id="aplicativos" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={120}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card title="Chamados por Aplicativo / Streaming" sub="Suporte a apps incluídos no plano — contagem por ocorrências nos chamados" accent={T.teal}>
              <Insight text={mes==="jan"
                ? "<strong>HBO Max (110), Canaã TV (106) e Kaspersky (106)</strong> lideram. 137 atendimentos de apps em janeiro."
                : "<strong>Canaã TV, HBO Max e Kaspersky empatam em 76 chamados.</strong> Total caiu 36% vs janeiro."}/>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={d.apps} layout="vertical" barCategoryGap="20%">
                  <XAxis type="number" tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    label={{ value:"Chamados", position:"insideBottom", offset:-2, fill:T.text3, fontSize:10 }}/>
                  <YAxis type="category" dataKey="name" tick={{ fill:T.text2, fontSize:11 }} width={90} axisLine={false} tickLine={false}/>
                  <Tooltip {...tooltipStyle} formatter={v => [v+" chamados", "Volume"]}/>
                  <Bar dataKey="v" name="Chamados" radius={[0,4,4,0]}>
                    {d.apps.map((_, i) => <Cell key={i} fill={[T.accent,T.purple,T.teal,T.green,T.amber,"#10b981","#f97316"][i]} />)}
                    <LabelList dataKey="v" position="right" style={{ fill:T.text2, fontSize:10.5, fontFamily:"monospace" }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Chamados & O.S por Semana do Mês" sub="Distribuição temporal — semana calculada por data de criação do chamado / data reservada da O.S" accent={T.amber}>
              <Insight text={mes==="jan"
                ? "<strong>Semanas 3 e 4 concentram 53% dos chamados.</strong> O.S distribuídas de forma mais uniforme (col. 'Data reservada')."
                : "<strong>Chamados uniformes; O.S concentradas nas semanas 1 e 2</strong> pelo volume de conformidade e contratos gerados."}/>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.weekly} barGap={4} margin={{ bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="w" tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    label={{ value:"Semana", position:"insideBottom", offset:-8, fill:T.text3, fontSize:10 }}/>
                  <YAxis tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    label={{ value:"Quantidade", angle:-90, position:"insideLeft", offset:12, fill:T.text3, fontSize:10 }}/>
                  <Tooltip {...tooltipStyle} formatter={(v, name) => [fmt(v), name]}/>
                  <Legend iconSize={9} wrapperStyle={{ fontSize:11, color:T.text2, paddingTop:8 }}/>
                  <Bar dataKey="chamados" name="Chamados de Suporte" fill={T.accent} radius={[4,4,0,0]}>
                    <LabelList dataKey="chamados" position="top" style={{ fill:T.text2, fontSize:9.5, fontFamily:"monospace" }}/>
                  </Bar>
                  <Bar dataKey="os" name="Ordens de Serviço" fill={T.purple} radius={[4,4,0,0]}>
                    <LabelList dataKey="os" position="top" style={{ fill:T.text2, fontSize:9.5, fontFamily:"monospace" }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          </FadeSection>

          {/* ─── 04. O.S COMPOSIÇÃO ─── */}
          <div id="atendimento" style={{ scrollMarginTop: 70 }} />
          <div id="ordens" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={60}>
          <SectionHeader n="03" title="Ordens de Serviço — Campo vs Administrativas" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card title="Composição de O.S — Janeiro × Fevereiro" sub="Campo (R$85/OS) vs Administrativas (R$8/OS) — mix radicalmente diferente entre os meses" accent={T.red}>
              <Insight text="Em fevereiro, <strong>60% das O.S são administrativas</strong> (conformidade + contrato + status). O custo de campo cresceu 87%, não os 281% do total bruto."/>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={COMPARE_OS} margin={{ bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{ fill:T.text2, fontSize:11 }} axisLine={false} tickLine={false}
                    label={{ value:"Mês", position:"insideBottom", offset:-8, fill:T.text3, fontSize:10 }}/>
                  <YAxis tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    label={{ value:"Qtd. de O.S", angle:-90, position:"insideLeft", offset:12, fill:T.text3, fontSize:10 }}/>
                  <Tooltip {...tooltipStyle} formatter={(v, n) => [fmt(v)+" O.S", n]}/>
                  <Legend iconSize={9} wrapperStyle={{ fontSize:11, color:T.text2, paddingTop:8 }}/>
                  <Bar dataKey="campo" name="Campo (R$85/OS)" stackId="s" fill={T.red}>
                    <LabelList dataKey="campo" position="center" style={{ fill:"#fff", fontSize:10.5, fontWeight:700, fontFamily:"monospace" }}/>
                  </Bar>
                  <Bar dataKey="admin" name="Administrativas (R$8/OS)" stackId="s" fill={T.amber} radius={[4,4,0,0]}>
                    <LabelList dataKey="admin" position="center" style={{ fill:"#000", fontSize:10.5, fontWeight:700, fontFamily:"monospace" }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="FCR — Taxa de Resolução no 1º Contato" sub="Meta ideal: ≥ 70% · Jan: 56,6% · Fev: 49,3% · calculado via campo 'Novo status' (contém 'Solucion')" accent={T.green}>
              <Insight text={`FCR atual de <strong>${d.fcr}%</strong> — ${d.fcr >= 70 ? "dentro da meta." : d.fcr >= 50 ? "abaixo da meta de 70%. Cada recontato = +R$12 de custo." : "abaixo da meta de 70%. Cada recontato = +R$12. Ação urgente necessária."}`}/>
              <FCRGauge value={d.fcr} />
              <div style={{ marginTop:12 }}>
                {[["Meta mínima", 70, T.green], ["Atual", d.fcr, d.fcr>=70?T.green:d.fcr>=50?T.amber:T.red], ["Benchmark", 65, T.teal]].map(([l, v, c]) => (
                  <div key={l} style={{ marginBottom:8 }}>
                    <ProgressBar value={v} max={100} color={c} label={l} labelRight={fmt(v,1)+"%"} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          </FadeSection>

          {/* ─── 05. DRE + COMPARATIVO ─── */}
          <div id="financeiro" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={80}>
          <SectionHeader n="04" title="Demonstrativo Financeiro" />
          <div style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:14, marginBottom:14 }}>
            {/* DRE */}
            <Card title={`Demonstrativo de Resultado — ${d.label}`} sub="Receita versus cada linha de custo operacional" accent={T.accent}>
              <Insight text={d.margin >= 0
                ? `Margem positiva de <strong>${brl(d.margin)} (${fmt(marginPct,1)}%)</strong>. O.S campo é o maior custo (74,9% do total).`
                : `Margem negativa de <strong>−${brl(Math.abs(d.margin))} (${fmt(marginPct,1)}%)</strong>. Custo/cliente = ${fmt(costPerClient/d.ticket,1)}× a mensalidade.`}/>
              {[
                { label:"Receita — novos clientes", detail:`${d.installed} × ${brl(d.ticket,2)}`, v:d.revenue, type:"rec" },
                { label:"( − ) Atendimentos", detail:`${fmt(d.tickets)} × R$12,00`, v: d.tickets*12, type:"cost" },
                { label:"( − ) O.S em Campo", detail:`${fmt(d.osCampo)} × R$85,00`, v: d.osCampo*85, type:"cost" },
                { label:"( − ) O.S Administrativas", detail:`${fmt(d.osAdmin)} × R$8,00`, v: d.osAdmin*8, type:"cost" },
              ].map((r, i) => (
                <div key={i} style={{ display:"flex", alignItems:"baseline", gap:8, padding:"8px 0",
                  borderBottom:`1px solid ${T.border}22` }}>
                  <span style={{ flex:1, fontSize:12.5, color:T.text2 }}>{r.label}</span>
                  <span style={{ fontSize:10.5, color:T.text3, fontFamily:"monospace" }}>{r.detail}</span>
                  <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600,
                    color: r.type==="rec" ? T.green : T.red }}>
                    {r.type==="rec" ? "+" : "−"} {brl(r.v)}
                  </span>
                </div>
              ))}
              <div style={{ display:"flex", alignItems:"baseline", gap:8, padding:"12px 0 0",
                borderTop:`1px solid ${T.border}` }}>
                <span style={{ flex:1, fontSize:13, fontWeight:700, color:T.text }}>Margem Operacional</span>
                <span style={{ fontSize:20, fontWeight:800, color: margin>=0?T.green:T.red }}>
                  {(margin>=0?"+":"")+brl(margin)}
                </span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                {[
                  { l:"Custo/cliente", v:brl(costPerClient,2), c:T.amber },
                  { l:"Break-even", v:fmt(be,2)+"× receita", c:be<=1?T.green:T.red },
                ].map(x => (
                  <div key={x.l} style={{ background:T.bg, borderRadius:8, padding:"10px 12px",
                    border:`1.5px solid ${T.border}` }}>
                    <div style={{ fontSize:11, color:T.text3 }}>{x.l}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:x.c, marginTop:2, fontFamily:"monospace" }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Comparativo Jan×Fev */}
            <Card title="Comparativo Financeiro Janeiro × Fevereiro" sub="Receita, custo total e margem operacional — impacto real do crescimento de O.S em fevereiro" accent={T.purple}>
              <Insight text="Janeiro: <strong>margem +25,1%</strong>. Fevereiro: <strong>margem −82,6%</strong>. Custo cresceu 79,3%; receita caiu 26,4%."/>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={COMPARE} barGap={6} margin={{ bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{ fill:T.text2, fontSize:11 }} axisLine={false} tickLine={false}
                    label={{ value:"Linha financeira", position:"insideBottom", offset:-8, fill:T.text3, fontSize:10 }}/>
                  <YAxis tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => "R$"+fmt(Math.abs(v)/1000,0)+"k"}
                    label={{ value:"R$ (mil)", angle:-90, position:"insideLeft", offset:12, fill:T.text3, fontSize:10 }}/>
                  <Tooltip {...tooltipStyle} formatter={v => [brl(v), ""]}/>
                  <Legend iconSize={9} wrapperStyle={{ fontSize:11, color:T.text2, paddingTop:8 }}/>
                  <Bar dataKey="jan" name="Janeiro 2026" fill={T.accent} radius={[4,4,0,0]}>
                    <LabelList dataKey="jan" position="top" formatter={v => "R$"+fmt(Math.abs(v)/1000,0)+"k"} style={{ fill:T.text2, fontSize:9.5, fontFamily:"monospace" }}/>
                  </Bar>
                  <Bar dataKey="fev" name="Fevereiro 2026" fill={T.red} radius={[4,4,0,0]}>
                    <LabelList dataKey="fev" position="top" formatter={v => (v<0?"−":"")+"R$"+fmt(Math.abs(v)/1000,0)+"k"} style={{ fill:T.text2, fontSize:9.5, fontFamily:"monospace" }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          </FadeSection>

          {/* ─── 06. PLANOS + DIST CUSTO ─── */}
          <div id="comparativo" style={{ scrollMarginTop: 70 }} />
          <div id="planos" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={100}>
          <SectionHeader n="05" title="Mix de Planos & Distribuição de Custo por Cliente" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Card title="Distribuição por Plano Contratado" sub="Volume de clientes e receita por faixa de velocidade — fonte: relatório de vendas ativadas" accent={T.green}>
              <Insight text={mes==="jan"
                ? "<strong>500 MB: 65,8% dos clientes</strong>, mas só 59% da receita. 1 Giga tem ticket 81% maior que 500 MB."
                : "<strong>500 MB: 61,9% dos clientes.</strong> Ticket médio caiu R$8 vs janeiro — mix puxado para planos menores."}/>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={d.planos} margin={{ bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
                  <XAxis dataKey="name" tick={{ fill:T.text2, fontSize:11 }} axisLine={false} tickLine={false}
                    label={{ value:"Plano de velocidade", position:"insideBottom", offset:-8, fill:T.text3, fontSize:10 }}/>
                  <YAxis tick={{ fill:T.text3, fontSize:10 }} axisLine={false} tickLine={false}
                    label={{ value:"Clientes", angle:-90, position:"insideLeft", offset:12, fill:T.text3, fontSize:10 }}/>
                  <Tooltip {...tooltipStyle} formatter={(v,n) => [n==="qtd"?fmt(v)+" clientes":brl(v), n==="qtd"?"Clientes":"Receita"]}/>
                  <Legend iconSize={9} wrapperStyle={{ fontSize:11, color:T.text2, paddingTop:8 }}/>
                  <Bar dataKey="qtd" name="Nº de Clientes" radius={[4,4,0,0]}>
                    {d.planos.map((e,i) => <Cell key={i} fill={e.fill}/>)}
                    <LabelList dataKey="qtd" position="top" style={{ fill:T.text2, fontSize:10, fontFamily:"monospace" }}/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Distribuição de Custo por Cliente" sub="Custo real por novo cliente (atendimentos + O.S) — fonte: cruzamento de login entre relatórios" accent={T.amber}>
              <Insight text={mes==="jan"
                ? "<strong>57,9% dos clientes custaram entre R$51–150.</strong> Apenas 4 clientes acima de R$301 (max R$424)."
                : "<strong>68,5% custaram acima de R$200</strong> — inversão total vs janeiro. Custo médio: R$97→R$222. Max: R$756."}/>
              <div style={{ marginTop:4 }}>
                {d.distCusto.filter(x => x.n > 0).map((x, i) => {
                  const total = d.distCusto.reduce((a,b) => a+b.n, 0);
                  return (
                    <div key={i} style={{ marginBottom:8 }}>
                      <ProgressBar value={x.n} max={Math.max(...d.distCusto.map(d=>d.n))}
                        color={x.fill} label={x.faixa}
                        labelRight={`${x.n} clientes (${fmt(x.n/total*100,1)}%)`} />
                    </div>
                  );
                })}
                <div style={{ marginTop:10, padding:"8px 10px", background:T.bg, borderRadius:7, border:`1px solid ${T.border}`,
                  fontSize:11, color:T.text3, display:"flex", justifyContent:"space-between", boxShadow:T.shadow }}>
                  <span>Custo médio/cliente</span>
                  <span style={{ fontFamily:"monospace", fontWeight:700, color:T.text }}>
                    {brl(mes==="jan" ? 96.96 : 221.78, 2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          </FadeSection>

          {/* ─── 07. AGENTES ─── */}
          <div id="agentes" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={60}>
          <SectionHeader n="06" title="Ranking de Atendentes" />
          <Card title="Desempenho por Atendente — Novos Clientes" sub="Volume de chamados atendidos e FCR (resolução no 1º contato) — fonte: coluna 'Usuário' dos relatórios de atendimento" accent={T.teal} style={{ marginBottom:14 }}>
            <Insight text={mes==="jan"
              ? "Top 5 em volume (Tayane, Nathalia, Thiago, Ana, Sebastião): <strong>FCR entre 19–31%</strong> — atuam como triagem. Priscilla, Lays e Walison resolvem 98–100%, mas atendem menos clientes."
              : "<strong>FCR dos top 5 caiu para 10–20% em fevereiro.</strong> Livia Reis (92,9%), Caique Abreu (92,7%) e Walison (97,1%) mantêm alta resolução. Capacitar os atendentes de alto volume é urgente."}/>
            <AgentsTable agents={d.agents} />
          </Card>

          </FadeSection>

          {/* ─── 08. CENÁRIOS ─── */}
          <div id="cenarios" style={{ scrollMarginTop: 70 }} />
          <FadeSection delay={80}>
          <SectionHeader n="07" title="Projeção de Cenários" />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
            {[
              {
                type:"Base", label:"Operação Atual",
                desc:"FCR e O.S no nível atual. Custos e margens conforme relatórios reais do mês selecionado.",
                margem: margin, pct: marginPct, color:T.accent,
                impact:`Custo: ${brl(d.cost)} (${fmt(costPct,1)}% da receita)`,
              },
              {
                type:"Otimista", label:"FCR 70% + 30% menos O.S campo",
                desc:"Onboarding digital + checklist técnico obrigatório. Atingível em 90 dias.",
                margem: d.revenue - (Math.round(d.contacted*(d.fcr/100)*1 + d.contacted*(1-d.fcr/100)*2.1)*12 + Math.round(d.osCampo*0.70)*85 + d.osAdmin*8),
                pct: 0, color:T.green,
                impact:"",
              },
              {
                type:"Pessimista", label:"FCR 40% + O.S campo +20%",
                desc:"Sem ação corretiva e crescimento da base, os custos tornam-se insustentáveis.",
                margem: d.revenue - (Math.round(d.contacted*2.9)*12 + Math.round(d.osCampo*1.20)*85 + d.osAdmin*1.20*8),
                pct: 0, color:T.red,
                impact:"",
              },
            ].map((sc, i) => {
              const pct = (sc.margem / d.revenue * 100);
              const c = sc.color;
              return (
                <div key={i} style={{ background:T.card, border:`1.5px solid ${T.border}`,
                  borderRadius:12, padding:"18px 20px",
                  transition:"all .2s", cursor:"default" }}>
                  <div style={{ display:"inline-flex", fontSize:10, fontWeight:700, letterSpacing:".4px",
                    textTransform:"uppercase", padding:"3px 9px", borderRadius:20,
                    background:c+"22", color:c, marginBottom:10 }}>{sc.type}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:4, lineHeight:1.35 }}>{sc.label}</div>
                  <div style={{ fontSize:11.5, color:T.text3, lineHeight:1.5, marginBottom:14 }}>{sc.desc}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:sc.margem>=0?T.green:T.red, lineHeight:1 }}>
                    {(sc.margem>=0?"+":"")+brl(sc.margem)}
                  </div>
                  <div style={{ fontSize:11, color:T.text3, marginTop:3 }}>Margem projetada</div>
                  <div style={{ fontSize:11.5, fontWeight:600, color:c, marginTop:10,
                    paddingTop:10, borderTop:`1px solid ${T.border}aa` }}>
                    {sc.impact || `${(pct>=0?"+":"")+fmt(pct,1)}% da receita`}
                  </div>
                </div>
              );
            })}
          </div>

        </FadeSection>
        </div>

        {/* Footer */}
        <footer style={{ padding:"14px 24px", borderTop:`1px solid ${T.border}`, background:'#ffffff',
          fontSize:11.5, color:T.text3, display:"flex", justifyContent:"space-between", gap:16 }}>
          <em>Premissas: R$12/atendimento · R$85/O.S campo · R$8/O.S administrativa · Dados reais de Jan/Fev 2026</em>
          <span>Projetado por João Vitor · Canaã Fibra</span>
        </footer>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f0f2f7; }
        ::-webkit-scrollbar-thumb { background: #c8d0e0; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .section-fade { animation: fadeUp .4s ease both; }
        .recharts-cartesian-grid-horizontal line { stroke: #dde2ee !important; }
        .recharts-cartesian-grid-vertical line { display: none !important; }
      `}</style>
    </div>
  );
}
