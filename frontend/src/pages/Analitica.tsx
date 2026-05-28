import { useState, useEffect } from "react";
import { api } from "../services/api";
import MiniGrafo from "../components/MiniGrafo";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

// ── Tipos ──────────────────────────────────────────────────────────────────

type Proveedor = {
  categoria: string; pais: string; tienda: string;
  arancelPct: number; costoBaseArs: number; costoFinalArs: number;
};
type Courier = {
  courier: string; calificacion: number; totalPaquetes: number;
  totalIncidencias: number; tasaIncidenciasPct: number;
  diasPromedioEnvio: number; scoreEficiencia: number;
};
type Arancel = {
  categoria: string; cantOfertas: number; arancelPromedio: number;
  arancelMin: number; arancelMax: number; costoBasePromArs: number;
  arancelPromArs: number; costoFinalPromArs: number; pctArancelSobreFinal: number;
};
type Riesgo = {
  pais: string; region: string; arancelPromPct: number;
  totalPaquetes: number; paquetesRetenidos: number;
  paquetesConIncidencia: number; tasaRetencionPct: number;
};
type Cliente = {
  cliente: string; email: string; totalCompras: number;
  totalPaquetes: number; paquetesRetenidos: number;
  totalIncidencias: number; calCourierProm: number; tasaProblemasPct: number;
};

type GrafoNode = { id: string; label: string; name: string };
type GrafoLink = { source: string; target: string; type: string };
type GrafoData = { nodes: GrafoNode[]; links: GrafoLink[] };

const EMPTY_GRAFO: GrafoData = { nodes: [], links: [] };

// ── Query builders ─────────────────────────────────────────────────────────

const buildMejorProveedorQuery = (categoria: string) =>
`MATCH (prod:Producto)-[:PERTENECE_A]->
  (cat:CategoriaProducto {nombre: "${categoria}"})
MATCH (prod)-[:TIENE_OFERTA]->(o:OfertaProducto)
  -[:VENDIDA_POR]->(t:TiendaExterior)
  -[:UBICADA_EN]->(pais:PaisOrigen)
MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)
MATCH (o)-[:USA_MONEDA]->(m:Moneda)
  -[:TIENE_COTIZACION]->(cot:Cotizacion {monedaDestino: "ARS"})
MATCH (cat)-[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->
  (aPais:TarifaArancelariaPais {categoriaId: cat.id})
WITH pais, t,
     COALESCE(aPais.porcentaje, aBase.porcentaje) AS arancel,
     avg((o.precio + e.costo) * cot.valor) AS costoBasePromedio
RETURN
  pais.nombre AS pais,
  t.nombre AS tienda,
  round(arancel) AS arancelPct,
  round(costoBasePromedio) AS costoBaseArs,
  round(costoBasePromedio * (1 + arancel / 100)) AS costoFinalArs
ORDER BY costoFinalArs ASC`;

const buildEficienciaQuery = (courier: string) =>
`MATCH (c:Courier {nombre: "${courier}"})
OPTIONAL MATCH (c)<-[:TRANSPORTADO_POR]-(p:Paquete)
OPTIONAL MATCH (p)-[:TIENE_INCIDENCIA]->(i:Incidencia)
WITH c,
     count(DISTINCT p) AS totalPaquetes,
     count(DISTINCT i) AS totalIncidencias
OPTIONAL MATCH (c)<-[:OPERADO_POR]-(e:MetodoEnvio)
WITH c, totalPaquetes, totalIncidencias,
     avg(e.diasEstimados) AS diasPromedio
RETURN
  c.nombre AS courier,
  c.calificacion AS calificacion,
  totalPaquetes,
  totalIncidencias,
  CASE WHEN totalPaquetes > 0
    THEN round(toFloat(totalIncidencias) / totalPaquetes * 100, 1)
    ELSE 0 END AS tasaIncidenciasPct,
  round(diasPromedio, 1) AS diasPromedioEnvio,
  round(
    c.calificacion * (1 - toFloat(totalIncidencias) / (totalPaquetes + 1))
  , 2) AS scoreEficiencia`;

const buildArancelQuery = (categoria: string) =>
`MATCH (prod:Producto)-[:PERTENECE_A]->
  (cat:CategoriaProducto {nombre: "${categoria}"})
MATCH (prod)-[:TIENE_OFERTA]->(o:OfertaProducto)
  -[:VENDIDA_POR]->(t:TiendaExterior)
  -[:UBICADA_EN]->(pais:PaisOrigen)
MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)
MATCH (o)-[:USA_MONEDA]->(m:Moneda)
  -[:TIENE_COTIZACION]->(cot:Cotizacion {monedaDestino: "ARS"})
MATCH (cat)-[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->
  (aPais:TarifaArancelariaPais {categoriaId: cat.id})
WITH COALESCE(aPais.porcentaje, aBase.porcentaje) AS arancel,
     (o.precio + e.costo) * cot.valor AS costoBase
RETURN
  count(*) AS cantOfertas,
  round(avg(arancel), 1) AS arancelPromedio,
  round(min(arancel), 1) AS arancelMin,
  round(max(arancel), 1) AS arancelMax,
  round(avg(costoBase)) AS costoBasePromArs,
  round(avg(costoBase * arancel / 100)) AS arancelPromArs,
  round(avg(costoBase * (1 + arancel / 100))) AS costoFinalPromArs,
  round(
    toFloat(avg(costoBase * arancel / 100))
    / avg(costoBase * (1 + arancel / 100)) * 100, 1
  ) AS pctArancelSobreFinal`;

const buildRiesgoQuery = (pais: string) =>
`MATCH (pais:PaisOrigen {nombre: "${pais}"})
OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)
  <-[:VENDIDA_POR]-(:OfertaProducto)<-[:TIENE_OFERTA]-(prod:Producto)
  -[:PERTENECE_A]->(cat:CategoriaProducto)
  -[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->
  (aPais:TarifaArancelariaPais {categoriaId: cat.id})
WITH pais,
     avg(COALESCE(aPais.porcentaje, aBase.porcentaje)) AS arancelPromedio
OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)
  <-[:VENDIDA_POR]-(:OfertaProducto)<-[:TIENE_OFERTA]-(:Producto)
  <-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(p:Paquete)
WITH pais, arancelPromedio,
     count(DISTINCT p) AS totalPaquetes
OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)
  <-[:VENDIDA_POR]-(:OfertaProducto)<-[:TIENE_OFERTA]-(:Producto)
  <-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(pr:Paquete)
  -[:TIENE_ESTADO]->(:EstadoEnvio {nombre: "Retenido en aduana"})
WITH pais, arancelPromedio, totalPaquetes,
     count(DISTINCT pr) AS paquetesRetenidos
OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)
  <-[:VENDIDA_POR]-(:OfertaProducto)<-[:TIENE_OFERTA]-(:Producto)
  <-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(pi:Paquete)
  -[:TIENE_INCIDENCIA]->(:Incidencia)
RETURN
  pais.nombre AS pais, pais.region AS region,
  round(arancelPromedio, 1) AS arancelPromPct,
  totalPaquetes, paquetesRetenidos,
  count(DISTINCT pi) AS paquetesConIncidencia,
  CASE WHEN totalPaquetes > 0
    THEN round(toFloat(paquetesRetenidos) / totalPaquetes * 100, 1)
    ELSE 0 END AS tasaRetencionPct`;

const buildClienteQuery = (cliente: string) =>
`MATCH (cli:Cliente {nombre: "${cliente}"})-[:REALIZA]->(com:Compra)
WITH cli, count(DISTINCT com) AS totalCompras
OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(p:Paquete)
WITH cli, totalCompras,
     count(DISTINCT p) AS totalPaquetes
OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pr:Paquete)
  -[:TIENE_ESTADO]->(:EstadoEnvio {nombre: "Retenido en aduana"})
WITH cli, totalCompras, totalPaquetes,
     count(DISTINCT pr) AS paquetesRetenidos
OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pi:Paquete)
  -[:TIENE_INCIDENCIA]->(i:Incidencia)
WITH cli, totalCompras, totalPaquetes, paquetesRetenidos,
     count(DISTINCT i) AS totalIncidencias
OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pc:Paquete)
  -[:TRANSPORTADO_POR]->(c:Courier)
RETURN
  cli.nombre AS cliente, cli.email AS email,
  totalCompras, totalPaquetes, paquetesRetenidos, totalIncidencias,
  round(avg(c.calificacion), 2) AS calCourierProm,
  CASE WHEN totalPaquetes > 0
    THEN round(toFloat(paquetesRetenidos) / totalPaquetes * 100, 1)
    ELSE 0 END AS tasaProblemasPct`;

const GRAFO_QUERIES = {
  couriers:
`MATCH (n)-[r]->(m)
WHERE (n:Courier AND m:Paquete)
   OR (n:Paquete AND m:Incidencia)
RETURN labels(n)[0] AS fromLabel,
       COALESCE(n.id, n.codigo) AS fromId,
       COALESCE(n.nombre, n.codigo, n.id, "") AS fromName,
       type(r) AS relType,
       labels(m)[0] AS toLabel,
       COALESCE(m.id, m.codigo) AS toId,
       COALESCE(m.nombre, m.codigo, m.id, "") AS toName
LIMIT 300`,
  productos:
`MATCH (n)-[r]->(m)
WHERE (n:Producto AND m:OfertaProducto)
   OR (n:OfertaProducto AND m:TiendaExterior)
   OR (n:TiendaExterior AND m:PaisOrigen)
   OR (n:Producto AND m:CategoriaProducto)
RETURN labels(n)[0] AS fromLabel,
       COALESCE(n.id, n.codigo) AS fromId,
       COALESCE(n.nombre, n.codigo, n.id, "") AS fromName,
       type(r) AS relType,
       labels(m)[0] AS toLabel,
       COALESCE(m.id, m.codigo) AS toId,
       COALESCE(m.nombre, m.codigo, m.id, "") AS toName
LIMIT 300`,
  clientes:
`MATCH (n)-[r]->(m)
WHERE (n:Cliente AND m:Compra)
   OR (n:Compra AND m:Orden)
   OR (n:Compra AND m:Paquete)
   OR (n:Orden AND m:Paquete)
   OR (n:Paquete AND m:EstadoEnvio)
   OR (n:Paquete AND m:Courier)
RETURN labels(n)[0] AS fromLabel,
       COALESCE(n.id, n.codigo) AS fromId,
       COALESCE(n.nombre, n.codigo, n.id, "") AS fromName,
       type(r) AS relType,
       labels(m)[0] AS toLabel,
       COALESCE(m.id, m.codigo) AS toId,
       COALESCE(m.nombre, m.codigo, m.id, "") AS toName
LIMIT 300`,
};

// ── CypherBlock ────────────────────────────────────────────────────────────

function CypherBlock({ query, label }: { query: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-500 font-mono"
      >
        <span className="flex items-center gap-2">
          <span className={`text-[10px] transition-transform duration-150 inline-block ${open ? "rotate-90" : ""}`}>▶</span>
          <span className="text-slate-400">Consulta Cypher</span>
          <span className="text-indigo-400 font-semibold">{label}</span>
        </span>
        <span className="text-slate-300 text-[10px] uppercase tracking-wide">Neo4j</span>
      </button>
      {open && (
        <div className="relative bg-slate-900">
          <button
            onClick={() => { navigator.clipboard.writeText(query); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors z-10"
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
          <pre className="overflow-x-auto p-4 pr-16 text-[11px] leading-relaxed text-slate-300 font-mono whitespace-pre">
            <code>{query}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Helpers UI ─────────────────────────────────────────────────────────────

function RiskBadge({ pct }: { pct: number }) {
  if (pct === 0) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Sin riesgo</span>;
  if (pct < 30) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Bajo {pct}%</span>;
  if (pct < 70) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Medio {pct}%</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Alto {pct}%</span>;
}

function ProgressBar({ value, max, color = "indigo" }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500", emerald: "bg-emerald-500", orange: "bg-orange-500",
    red: "bg-red-500", amber: "bg-amber-500",
  };
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${colors[color] ?? colors.indigo}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
      </div>
      <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{badge}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────

export default function Analitica() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [couriers, setCouriers]       = useState<Courier[]>([]);
  const [aranceles, setAranceles]     = useState<Arancel[]>([]);
  const [riesgos, setRiesgos]         = useState<Riesgo[]>([]);
  const [clientes, setClientes]       = useState<Cliente[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // subgrafos
  const [grafoCouriers,  setGrafoCouriers]  = useState<GrafoData>(EMPTY_GRAFO);
  const [grafoProductos, setGrafoProductos] = useState<GrafoData>(EMPTY_GRAFO);
  const [grafoClientes,  setGrafoClientes]  = useState<GrafoData>(EMPTY_GRAFO);
  const [loadingGrafos,  setLoadingGrafos]  = useState(true);
  const [tabGrafo,       setTabGrafo]       = useState<"couriers" | "productos" | "clientes">("couriers");

  // filas expandidas
  const [expandedCourier, setExpandedCourier] = useState<string | null>(null);
  const [expandedArancel, setExpandedArancel] = useState<string | null>(null);
  const [expandedRiesgo, setExpandedRiesgo]   = useState<string | null>(null);
  const [expandedCliente, setExpandedCliente] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get("/grafo/red-couriers"),
      api.get("/grafo/cadena-productos"),
      api.get("/grafo/flujo-clientes"),
    ])
      .then(([gc, gp, gcl]) => {
        setGrafoCouriers(gc.data);
        setGrafoProductos(gp.data);
        setGrafoClientes(gcl.data);
      })
      .finally(() => setLoadingGrafos(false));
  }, []);

  useEffect(() => {
    Promise.all([
      api.get("/analitica/mejor-proveedor-categoria"),
      api.get("/analitica/eficiencia-couriers"),
      api.get("/analitica/impacto-arancelario"),
      api.get("/analitica/riesgo-paises"),
      api.get("/analitica/perfil-clientes"),
    ])
      .then(([p, c, a, r, cl]) => {
        setProveedores(p.data);
        setCouriers(c.data);
        setAranceles(a.data);
        setRiesgos(r.data);
        setClientes(cl.data);
      })
      .catch(() => setError("No se pudieron cargar los datos. ¿Está el backend corriendo?"))
      .finally(() => setLoading(false));
  }, []);

  const proveedoresPorCategoria = proveedores.reduce<Record<string, Proveedor[]>>((acc, p) => {
    if (!acc[p.categoria]) acc[p.categoria] = [];
    acc[p.categoria].push(p);
    return acc;
  }, {});

  const maxScore      = Math.max(...couriers.map((c) => c.scoreEficiencia), 1);
  const maxArancelPct = Math.max(...aranceles.map((a) => a.pctArancelSobreFinal), 1);

  const toggle = (current: string | null, key: string, set: (v: string | null) => void) =>
    set(current === key ? null : key);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Analítica de Gestión</h2>
        <p className="text-slate-500 text-sm mt-1">
          Consultas estratégicas para la toma de decisiones en importaciones internacionales
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>}

      {/* ── 1. Mejor proveedor por categoría ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <SectionHeader
          title="Mejor proveedor por categoría"
          subtitle="Ranking de país/tienda según costo final en ARS (producto + envío + arancel)"
          badge="Política de compras"
        />
        {loading ? <Skeleton /> : (
          <div className="space-y-5">
            {Object.entries(proveedoresPorCategoria).map(([cat, rows]) => (
              <div key={cat}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{cat}</p>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                      <tr>
                        <th className="text-left px-3 py-2">Tienda</th>
                        <th className="text-left px-3 py-2">País</th>
                        <th className="text-right px-3 py-2">Arancel</th>
                        <th className="text-right px-3 py-2">Base ARS</th>
                        <th className="text-right px-3 py-2">Total ARS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className={`border-t border-slate-100 ${i === 0 ? "bg-emerald-50" : ""}`}>
                          <td className="px-3 py-2 font-medium text-slate-700">
                            {i === 0 && <span className="mr-1.5 text-emerald-600">✓</span>}
                            {r.tienda}
                          </td>
                          <td className="px-3 py-2 text-slate-500">{r.pais}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={`font-medium ${r.arancelPct === 0 ? "text-emerald-600" : r.arancelPct >= 30 ? "text-red-500" : "text-orange-500"}`}>
                              {r.arancelPct}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right text-slate-500 text-xs">{formatARS(r.costoBaseArs)}</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-800">{formatARS(r.costoFinalArs)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CypherBlock query={buildMejorProveedorQuery(cat)} label={cat} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 2 y 3 en grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── 2. Eficiencia de couriers ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionHeader
            title="Eficiencia de couriers"
            subtitle="Score compuesto: calificación × confiabilidad × velocidad"
            badge="KPI logístico"
          />
          {loading ? <Skeleton /> : (
            <div className="space-y-1">
              {couriers.map((c, i) => {
                const isOpen = expandedCourier === c.courier;
                return (
                  <div key={c.courier}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs w-4 text-right">{i + 1}.</span>
                          <span className="font-medium text-slate-700">{c.courier}</span>
                          <span className="text-xs text-amber-500">{"★".repeat(Math.round(c.calificacion))}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span title="Paquetes">{c.totalPaquetes} paq.</span>
                          {c.totalIncidencias > 0 && <span className="text-red-400">{c.totalIncidencias} inc.</span>}
                          <span className="font-semibold text-slate-800 w-8 text-right">{c.scoreEficiencia}</span>
                          <button
                            onClick={() => toggle(expandedCourier, c.courier, setExpandedCourier)}
                            className="ml-1 text-slate-300 hover:text-indigo-400 transition-colors font-mono text-[10px]"
                            title="Ver consulta Cypher"
                          >
                            {isOpen ? "▼" : "▶"}
                          </button>
                        </div>
                      </div>
                      <ProgressBar value={c.scoreEficiencia} max={maxScore} color={c.scoreEficiencia > 3 ? "emerald" : c.scoreEficiencia > 1 ? "amber" : "red"} />
                    </div>
                    {isOpen && (
                      <CypherBlock query={buildEficienciaQuery(c.courier)} label={c.courier} />
                    )}
                  </div>
                );
              })}
              <p className="text-xs text-slate-400 pt-2">Score = calificación × (1 − incidencias/paquetes)</p>
            </div>
          )}
        </div>

        {/* ── 3. Impacto arancelario ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <SectionHeader
            title="Impacto arancelario por categoría"
            subtitle="Porcentaje del precio final que representa el arancel aduanero"
            badge="Compliance"
          />
          {loading ? <Skeleton /> : (
            <div className="space-y-1">
              {aranceles.map((a, i) => {
                const isOpen = expandedArancel === a.categoria;
                return (
                  <div key={i}>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{a.categoria}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{a.arancelMin}%–{a.arancelMax}%</span>
                          <span className="font-semibold text-slate-800 w-12 text-right">{a.pctArancelSobreFinal}%</span>
                          <button
                            onClick={() => toggle(expandedArancel, a.categoria, setExpandedArancel)}
                            className="ml-1 text-slate-300 hover:text-indigo-400 transition-colors font-mono text-[10px]"
                            title="Ver consulta Cypher"
                          >
                            {isOpen ? "▼" : "▶"}
                          </button>
                        </div>
                      </div>
                      <ProgressBar value={a.pctArancelSobreFinal} max={maxArancelPct} color={a.pctArancelSobreFinal === 0 ? "emerald" : a.pctArancelSobreFinal > 15 ? "red" : "amber"} />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Arancel prom: {formatARS(a.arancelPromArs)}</span>
                        <span>Total prom: {formatARS(a.costoFinalPromArs)}</span>
                      </div>
                    </div>
                    {isOpen && (
                      <CypherBlock query={buildArancelQuery(a.categoria)} label={a.categoria} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Mapa de riesgo por país ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <SectionHeader
          title="Mapa de riesgo por país de origen"
          subtitle="Arancel promedio, tasa de retención en aduana e incidencias — base para estrategia de sourcing"
          badge="Risk management"
        />
        {loading ? <Skeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left pb-2 w-6"></th>
                  <th className="text-left pb-2">País</th>
                  <th className="text-left pb-2">Región</th>
                  <th className="text-right pb-2">Arancel prom.</th>
                  <th className="text-right pb-2">Paquetes</th>
                  <th className="text-right pb-2">Retenidos</th>
                  <th className="text-right pb-2">Incidencias</th>
                  <th className="text-right pb-2">Tasa retención</th>
                </tr>
              </thead>
              <tbody>
                {riesgos.flatMap((r) => {
                  const isOpen = expandedRiesgo === r.pais;
                  const cols = 8;
                  return [
                    <tr key={r.pais} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5">
                        <button
                          onClick={() => toggle(expandedRiesgo, r.pais, setExpandedRiesgo)}
                          className="text-slate-300 hover:text-indigo-400 transition-colors font-mono text-[10px]"
                          title="Ver consulta Cypher"
                        >
                          {isOpen ? "▼" : "▶"}
                        </button>
                      </td>
                      <td className="py-2.5 font-medium text-slate-800">{r.pais}</td>
                      <td className="py-2.5 text-slate-500 text-xs">{r.region}</td>
                      <td className="py-2.5 text-right">
                        <span className={`font-medium ${r.arancelPromPct === 0 ? "text-emerald-600" : r.arancelPromPct >= 25 ? "text-red-500" : "text-orange-500"}`}>
                          {r.arancelPromPct}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-slate-500">{r.totalPaquetes}</td>
                      <td className="py-2.5 text-right">
                        {r.paquetesRetenidos > 0 ? <span className="text-red-500 font-medium">{r.paquetesRetenidos}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 text-right">
                        {r.paquetesConIncidencia > 0 ? <span className="text-orange-500">{r.paquetesConIncidencia}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 text-right">
                        <RiskBadge pct={r.tasaRetencionPct} />
                      </td>
                    </tr>,
                    ...(isOpen ? [
                      <tr key={`${r.pais}-query`}>
                        <td colSpan={cols} className="pb-3 px-1">
                          <CypherBlock query={buildRiesgoQuery(r.pais)} label={r.pais} />
                        </td>
                      </tr>
                    ] : []),
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 5. Perfil de clientes ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <SectionHeader
          title="Perfil de actividad de clientes"
          subtitle="Ranking por compras, problemas y tasa de retención — base para CRM y seguimiento preventivo"
          badge="CRM"
        />
        {loading ? <Skeleton /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="text-left pb-2 w-6"></th>
                  <th className="text-left pb-2">Cliente</th>
                  <th className="text-right pb-2">Compras</th>
                  <th className="text-right pb-2">Paquetes</th>
                  <th className="text-right pb-2">Retenidos</th>
                  <th className="text-right pb-2">Incidencias</th>
                  <th className="text-right pb-2">★ Courier</th>
                  <th className="text-right pb-2">Tasa problemas</th>
                </tr>
              </thead>
              <tbody>
                {clientes.flatMap((c) => {
                  const isOpen = expandedCliente === c.cliente;
                  const cols = 8;
                  return [
                    <tr key={c.cliente} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5">
                        <button
                          onClick={() => toggle(expandedCliente, c.cliente, setExpandedCliente)}
                          className="text-slate-300 hover:text-indigo-400 transition-colors font-mono text-[10px]"
                          title="Ver consulta Cypher"
                        >
                          {isOpen ? "▼" : "▶"}
                        </button>
                      </td>
                      <td className="py-2.5">
                        <p className="font-medium text-slate-800">{c.cliente}</p>
                        <p className="text-xs text-slate-400">{c.email}</p>
                      </td>
                      <td className="py-2.5 text-right text-slate-600 font-medium">{c.totalCompras}</td>
                      <td className="py-2.5 text-right text-slate-500">{c.totalPaquetes}</td>
                      <td className="py-2.5 text-right">
                        {c.paquetesRetenidos > 0 ? <span className="text-red-500 font-medium">{c.paquetesRetenidos}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 text-right">
                        {c.totalIncidencias > 0 ? <span className="text-orange-500">{c.totalIncidencias}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-2.5 text-right text-slate-500">
                        {c.calCourierProm ? `${c.calCourierProm}★` : "—"}
                      </td>
                      <td className="py-2.5 text-right">
                        <RiskBadge pct={c.tasaProblemasPct} />
                      </td>
                    </tr>,
                    ...(isOpen ? [
                      <tr key={`${c.cliente}-query`}>
                        <td colSpan={cols} className="pb-3 px-1">
                          <CypherBlock query={buildClienteQuery(c.cliente)} label={c.cliente} />
                        </td>
                      </tr>
                    ] : []),
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 6. Subgrafos temáticos ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <SectionHeader
          title="Visualización del grafo"
          subtitle="Subgrafos temáticos que muestran la estructura de relaciones del sistema"
          badge="Graph shape"
        />

        <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
          {(["couriers", "productos", "clientes"] as const).map((tab) => {
            const labels: Record<typeof tab, string> = {
              couriers:  "Red de Couriers",
              productos: "Cadena de Productos",
              clientes:  "Flujo de Clientes",
            };
            return (
              <button
                key={tab}
                onClick={() => setTabGrafo(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tabGrafo === tab
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {loadingGrafos ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm">Cargando grafo…</p>
            </div>
          </div>
        ) : (
          <>
            {tabGrafo === "couriers" && (
              <>
                <div className="mb-3 p-3 bg-sky-50 border border-sky-100 rounded-lg">
                  <p className="text-xs font-semibold text-sky-700 mb-0.5">Red de Couriers e Incidencias</p>
                  <p className="text-xs text-sky-600 leading-relaxed">
                    Muestra la red de transporte del sistema: cada <span className="font-medium">Courier</span> conectado
                    a los <span className="font-medium">Paquetes</span> que transportó, y cada paquete conectado
                    a sus <span className="font-medium">Incidencias</span>. Permite identificar visualmente qué couriers
                    concentran más incidencias y si hay patrones de falla agrupados por empresa transportista.
                    Útil para decidir con qué couriers renovar contratos.
                  </p>
                </div>
                <MiniGrafo graphData={grafoCouriers} height={380} />
                <CypherBlock query={GRAFO_QUERIES.couriers} label="Red de Couriers e Incidencias" />
              </>
            )}
            {tabGrafo === "productos" && (
              <>
                <div className="mb-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <p className="text-xs font-semibold text-emerald-700 mb-0.5">Cadena de Suministro de Productos</p>
                  <p className="text-xs text-emerald-600 leading-relaxed">
                    Visualiza la cadena completa desde el <span className="font-medium">Producto</span> hasta
                    su origen: producto → <span className="font-medium">Oferta</span> → <span className="font-medium">Tienda exterior</span> → <span className="font-medium">País de origen</span>,
                    más la <span className="font-medium">Categoría</span> a la que pertenece cada producto.
                    Permite ver qué productos tienen múltiples ofertas disponibles, desde qué países
                    se importa cada categoría y detectar dependencias de un único proveedor o país.
                  </p>
                </div>
                <MiniGrafo graphData={grafoProductos} height={380} />
                <CypherBlock query={GRAFO_QUERIES.productos} label="Cadena de Suministro" />
              </>
            )}
            {tabGrafo === "clientes" && (
              <>
                <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-700 mb-0.5">Flujo de Compras y Logística</p>
                  <p className="text-xs text-indigo-600 leading-relaxed">
                    Traza el recorrido completo de una importación: <span className="font-medium">Cliente</span> →
                    <span className="font-medium"> Compra</span> → <span className="font-medium">Orden/Paquete</span> →
                    <span className="font-medium"> Estado de envío</span> y <span className="font-medium">Courier</span> asignado.
                    Permite detectar cuellos de botella en el flujo logístico, ver qué clientes tienen paquetes
                    en estados problemáticos y analizar cómo se distribuyen los paquetes entre couriers
                    según cada compra.
                  </p>
                </div>
                <MiniGrafo graphData={grafoClientes} height={380} />
                <CypherBlock query={GRAFO_QUERIES.clientes} label="Flujo de Clientes" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
