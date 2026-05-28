import { useRef, useEffect, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";

type GrafoNode = { id: string; label: string; name: string; x?: number; y?: number };
type GrafoLink = { source: string | GrafoNode; target: string | GrafoNode; type: string };
type GrafoData = { nodes: GrafoNode[]; links: GrafoLink[] };

const NODE_COLORS: Record<string, string> = {
  Cliente:               "#6366f1",
  Producto:              "#10b981",
  Paquete:               "#f97316",
  TiendaExterior:        "#8b5cf6",
  Courier:               "#0ea5e9",
  PaisOrigen:            "#f43f5e",
  CategoriaProducto:     "#f59e0b",
  TarifaArancelaria:     "#dc2626",
  TarifaArancelariaPais: "#ec4899",
  Incidencia:            "#b91c1c",
  EstadoEnvio:           "#64748b",
  Orden:                 "#14b8a6",
  Compra:                "#06b6d4",
  MetodoEnvio:           "#84cc16",
  Moneda:                "#eab308",
  Deposito:              "#78716c",
  Aduana:                "#71717a",
  DeclaracionJurada:     "#a78bfa",
  OfertaProducto:        "#fb923c",
};

const DEFAULT_COLOR = "#94a3b8";

export default function MiniGrafo({ graphData, height = 350 }: { graphData: GrafoData; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hovered, setHovered] = useState<GrafoNode | null>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setWidth(containerRef.current.clientWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const nodeColor  = useCallback((n: GrafoNode) => NODE_COLORS[n.label] ?? DEFAULT_COLOR, []);
  const linkColor  = useCallback(() => "#334155", []);
  const linkWidth  = useCallback(() => 0.6, []);
  const nodeLabel  = useCallback((n: GrafoNode) => `${n.label}: ${n.name || n.id}`, []);

  const uniqueLabels = Array.from(new Set(graphData.nodes.map((n) => n.label)));

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-950" style={{ height }} ref={containerRef}>
      {width > 0 && (
        <ForceGraph2D
          width={width}
          height={height}
          graphData={graphData}
          nodeColor={nodeColor}
          nodeLabel={nodeLabel}
          linkColor={linkColor}
          linkWidth={linkWidth}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          onNodeHover={(n) => setHovered(n as GrafoNode | null)}
          backgroundColor="#020617"
          cooldownTicks={100}
        />
      )}

      {hovered && (
        <div className="absolute top-3 left-3 bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 pointer-events-none shadow-lg">
          <span className="font-semibold" style={{ color: NODE_COLORS[hovered.label] ?? DEFAULT_COLOR }}>
            {hovered.label}
          </span>
          <span className="mx-1 text-slate-400">·</span>
          {hovered.name || hovered.id}
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
        {uniqueLabels.map((label) => (
          <span
            key={label}
            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
            style={{ backgroundColor: NODE_COLORS[label] ?? DEFAULT_COLOR }}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="absolute top-3 right-3 text-[10px] text-slate-500">
        {graphData.nodes.length} nodos · {graphData.links.length} relaciones
      </div>
    </div>
  );
}
