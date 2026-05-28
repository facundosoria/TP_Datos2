import { useState, useEffect, useCallback, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { api } from "../services/api";

type GrafoNode = {
  id: string;
  label: string;
  name: string;
  // injected by force-graph
  x?: number;
  y?: number;
};

type GrafoLink = {
  source: string | GrafoNode;
  target: string | GrafoNode;
  type: string;
};

type GrafoData = {
  nodes: GrafoNode[];
  links: GrafoLink[];
};

// Color por tipo de nodo
const NODE_COLORS: Record<string, string> = {
  Cliente:                "#6366f1", // indigo
  Producto:               "#10b981", // emerald
  Paquete:                "#f97316", // orange
  TiendaExterior:         "#8b5cf6", // violet
  Courier:                "#0ea5e9", // sky
  PaisOrigen:             "#f43f5e", // rose
  CategoriaProducto:      "#f59e0b", // amber
  TarifaArancelaria:      "#dc2626", // red
  TarifaArancelariaPais:  "#ec4899", // pink
  Incidencia:             "#b91c1c", // dark red
  EstadoEnvio:            "#64748b", // slate
  Orden:                  "#14b8a6", // teal
  Compra:                 "#06b6d4", // cyan
  MetodoEnvio:            "#84cc16", // lime
  Moneda:                 "#eab308", // yellow
  Deposito:               "#78716c", // stone
  Aduana:                 "#71717a", // zinc
  DeclaracionJurada:      "#a78bfa", // purple-light
};

const DEFAULT_COLOR = "#94a3b8";

const LABEL_NAMES: Record<string, string> = {
  Cliente: "Cliente",
  Producto: "Producto",
  Paquete: "Paquete",
  TiendaExterior: "Tienda",
  Courier: "Courier",
  PaisOrigen: "País",
  CategoriaProducto: "Categoría",
  TarifaArancelaria: "Arancel Base",
  TarifaArancelariaPais: "Arancel × País",
  Incidencia: "Incidencia",
  EstadoEnvio: "Estado Envío",
  Orden: "Orden",
  Compra: "Compra",
  MetodoEnvio: "Método Envío",
  Moneda: "Moneda",
  Deposito: "Depósito",
  Aduana: "Aduana",
  DeclaracionJurada: "Dec. Jurada",
};

export default function Grafo() {
  const [graphData, setGraphData] = useState<GrafoData>({ nodes: [], links: [] });
  const [filtered, setFiltered] = useState<GrafoData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLabels, setActiveLabels] = useState<Set<string>>(new Set());
  const [allLabels, setAllLabels] = useState<string[]>([]);
  const [hovered, setHovered] = useState<GrafoNode | null>(null);
  const [selected, setSelected] = useState<GrafoNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });

  useEffect(() => {
    api
      .get("/grafo/datos")
      .then((r) => {
        const data: GrafoData = r.data;
        setGraphData(data);
        setFiltered(data);
        const labels = Array.from(new Set(data.nodes.map((n) => n.label))).sort();
        setAllLabels(labels);
        setActiveLabels(new Set(labels));
      })
      .catch(() => setError("No se pudo cargar el grafo. ¿Está el backend corriendo?"))
      .finally(() => setLoading(false));
  }, []);

  // Actualizar dims cuando cambia el contenedor
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [loading]);

  // Filtrar nodos según tipos activos
  useEffect(() => {
    if (activeLabels.size === allLabels.length) {
      setFiltered(graphData);
      return;
    }
    const visibleIds = new Set(
      graphData.nodes.filter((n) => activeLabels.has(n.label)).map((n) => n.id)
    );
    setFiltered({
      nodes: graphData.nodes.filter((n) => activeLabels.has(n.label)),
      links: graphData.links.filter((l) => {
        const src = typeof l.source === "string" ? l.source : l.source.id;
        const tgt = typeof l.target === "string" ? l.target : l.target.id;
        return visibleIds.has(src) && visibleIds.has(tgt);
      }),
    });
  }, [activeLabels, graphData, allLabels]);

  const toggleLabel = useCallback((label: string) => {
    setActiveLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const nodeColor = useCallback((node: GrafoNode) => {
    return NODE_COLORS[node.label] ?? DEFAULT_COLOR;
  }, []);

  const nodeVal = useCallback(
    (node: GrafoNode) => {
      const degree = filtered.links.filter((l) => {
        const src = typeof l.source === "string" ? l.source : (l.source as GrafoNode).id;
        const tgt = typeof l.target === "string" ? l.target : (l.target as GrafoNode).id;
        return src === node.id || tgt === node.id;
      }).length;
      return Math.max(1, degree * 0.5);
    },
    [filtered.links]
  );

  const nodeLabel = useCallback((node: GrafoNode) => {
    return `${node.label}: ${node.name || node.id}`;
  }, []);

  const linkColor = useCallback(() => "#cbd5e1", []);
  const linkWidth = useCallback(() => 0.5, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm">Cargando grafo…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visualización del Grafo</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {filtered.nodes.length} nodos · {filtered.links.length} relaciones
              {activeLabels.size < allLabels.length && (
                <span className="ml-2 text-indigo-500">
                  (filtrando {allLabels.length - activeLabels.size} tipo{allLabels.length - activeLabels.size !== 1 ? "s" : ""})
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveLabels(new Set(allLabels))}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              Mostrar todo
            </button>
            <button
              onClick={() => setActiveLabels(new Set())}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              Ocultar todo
            </button>
          </div>
        </div>

        {/* Filtros por tipo */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {allLabels.map((label) => {
            const color = NODE_COLORS[label] ?? DEFAULT_COLOR;
            const active = activeLabels.has(label);
            const count = graphData.nodes.filter((n) => n.label === label).length;
            return (
              <button
                key={label}
                onClick={() => toggleLabel(label)}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                  active
                    ? "border-transparent text-white"
                    : "border-slate-200 text-slate-400 bg-white opacity-50"
                }`}
                style={active ? { backgroundColor: color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.7)" : color }}
                />
                {LABEL_NAMES[label] ?? label}
                <span className={active ? "opacity-70" : ""}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Graph canvas + panel lateral */}
      <div className="flex flex-1 overflow-hidden relative">
        <div ref={containerRef} className="flex-1 bg-slate-950 relative">
          {dims.w > 0 && (
            <ForceGraph2D
              width={dims.w}
              height={dims.h}
              graphData={filtered}
              nodeColor={nodeColor}
              nodeVal={nodeVal}
              nodeLabel={nodeLabel}
              linkColor={linkColor}
              linkWidth={linkWidth}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={1}
              onNodeHover={(node) => setHovered(node as GrafoNode | null)}
              onNodeClick={(node) => setSelected(node as GrafoNode)}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(node, ctx, globalScale) => {
                const n = node as GrafoNode;
                if (globalScale < 2) return;
                const label = n.name || n.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.fillText(label, n.x ?? 0, (n.y ?? 0) + 8 / globalScale);
              }}
              backgroundColor="#020617"
              cooldownTicks={120}
            />
          )}

          {/* Tooltip hover */}
          {hovered && (
            <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg">
              <span className="font-semibold">{LABEL_NAMES[hovered.label] ?? hovered.label}</span>
              <span className="mx-1 text-slate-400">·</span>
              {hovered.name || hovered.id}
            </div>
          )}
        </div>

        {/* Panel lateral — detalle del nodo seleccionado */}
        {selected && (
          <div className="w-64 bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm">Detalle del nodo</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: NODE_COLORS[selected.label] ?? DEFAULT_COLOR }}
                />
                <span className="text-xs font-medium text-slate-500">
                  {LABEL_NAMES[selected.label] ?? selected.label}
                </span>
              </div>
              <p className="font-semibold text-slate-800 text-sm break-words">
                {selected.name || selected.id}
              </p>
              <div className="text-xs text-slate-500">
                <span className="font-medium">ID:</span> {selected.id}
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium mb-1">Relaciones</p>
                <p className="text-xs text-slate-600">
                  {
                    filtered.links.filter((l) => {
                      const src = typeof l.source === "string" ? l.source : (l.source as GrafoNode).id;
                      const tgt = typeof l.target === "string" ? l.target : (l.target as GrafoNode).id;
                      return src === selected.id || tgt === selected.id;
                    }).length
                  }{" "}
                  conexiones visibles
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-1">
                {filtered.links
                  .filter((l) => {
                    const src = typeof l.source === "string" ? l.source : (l.source as GrafoNode).id;
                    const tgt = typeof l.target === "string" ? l.target : (l.target as GrafoNode).id;
                    return src === selected.id || tgt === selected.id;
                  })
                  .slice(0, 10)
                  .map((l, i) => {
                    const src = typeof l.source === "string" ? l.source : (l.source as GrafoNode).id;
                    const tgt = typeof l.target === "string" ? l.target : (l.target as GrafoNode).id;
                    const other = src === selected.id ? tgt : src;
                    const dir = src === selected.id ? "→" : "←";
                    const otherNode = filtered.nodes.find((n) => n.id === other);
                    return (
                      <div key={i} className="flex items-start gap-1 text-xs text-slate-500">
                        <span className="text-slate-300 flex-shrink-0">{dir}</span>
                        <span className="text-indigo-400 flex-shrink-0">{l.type}</span>
                        <span className="truncate">{otherNode?.name || other}</span>
                      </div>
                    );
                  })}
                {filtered.links.filter((l) => {
                  const src = typeof l.source === "string" ? l.source : (l.source as GrafoNode).id;
                  const tgt = typeof l.target === "string" ? l.target : (l.target as GrafoNode).id;
                  return src === selected.id || tgt === selected.id;
                }).length > 10 && (
                  <p className="text-xs text-slate-400 italic">…y más</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
