import { useEffect, useState } from "react";
import { api } from "../services/api";

type Paquete = {
  codigo: string;
  trackingCode: string;
  pesoKg: number;
  fechaCreacion: string;
  courier: string;
  estado: string;
  cantIncidencias: number;
  cliente: string;
};

type PasoRecorrido = {
  tipoLugar: string;
  nombre: string;
  ciudad: string;
  pais: string;
  fecha: string;
  orden: number;
};

type DetallePaquete = {
  codigo: string;
  trackingCode: string;
  pesoKg: number;
  courier: { nombre: string; tipo: string; calificacion: number } | null;
  estado: { nombre: string; descripcion: string } | null;
  incidencias: { tipo: string; descripcion: string; gravedad: string }[];
  direccion: { calle: string; numero: string; ciudad: string; provincia: string } | null;
  cliente: string;
};

const estadoColor = (estado: string | null) => {
  if (!estado) return "bg-slate-100 text-slate-600";
  if (estado.includes("tránsito")) return "bg-blue-100 text-blue-700";
  if (estado.includes("Retenido")) return "bg-red-100 text-red-700";
  if (estado.includes("Entregado")) return "bg-green-100 text-green-700";
  return "bg-slate-100 text-slate-600";
};

const gravedadColor = (g: string) => {
  if (g === "Alta") return "bg-red-100 text-red-700";
  if (g === "Media") return "bg-orange-100 text-orange-700";
  return "bg-yellow-100 text-yellow-700";
};

const iconoLugar = (tipo: string) => {
  if (tipo === "Deposito") return "🏭";
  if (tipo === "Aduana") return "🔒";
  return "📍";
};

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<DetallePaquete | null>(null);
  const [recorrido, setRecorrido] = useState<PasoRecorrido[]>([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [filtroRetenidos, setFiltroRetenidos] = useState(false);

  useEffect(() => {
    const endpoint = filtroRetenidos ? "/paquetes/retenidos" : "/paquetes";
    setLoading(true);
    api
      .get(endpoint)
      .then((r) => setPaquetes(r.data))
      .catch(() => setError("Error al cargar paquetes"))
      .finally(() => setLoading(false));
  }, [filtroRetenidos]);

  const verDetalle = async (codigo: string) => {
    setLoadingDetalle(true);
    try {
      const [detalle, rec] = await Promise.all([
        api.get(`/paquetes/${codigo}`),
        api.get(`/paquetes/${codigo}/recorrido`),
      ]);
      setSeleccionado(detalle.data);
      setRecorrido(rec.data);
    } catch {
      setSeleccionado(null);
    } finally {
      setLoadingDetalle(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Paquetes</h2>
          <p className="text-slate-500 text-sm mt-1">{paquetes.length} paquetes</p>
        </div>
        <button
          onClick={() => setFiltroRetenidos(!filtroRetenidos)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filtroRetenidos
              ? "bg-red-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {filtroRetenidos ? "🔒 Mostrando retenidos" : "Ver retenidos"}
        </button>
      </div>

      <div className="space-y-3">
        {paquetes.map((p) => (
          <div
            key={p.codigo}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => verDetalle(p.codigo)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                  📦
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{p.codigo}</p>
                  <p className="text-xs text-slate-500">{p.trackingCode}</p>
                  {p.cliente && (
                    <p className="text-xs text-slate-400">Cliente: {p.cliente}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">{p.courier}</span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs text-slate-500">{p.pesoKg} kg</span>
                {p.cantIncidencias > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {p.cantIncidencias} incidencia{p.cantIncidencias !== 1 ? "s" : ""}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoColor(p.estado)}`}>
                  {p.estado || "Sin estado"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(seleccionado || loadingDetalle) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {loadingDetalle ? (
              <div className="p-8 text-center text-slate-400">Cargando detalle...</div>
            ) : seleccionado ? (
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{seleccionado.codigo}</h3>
                      <p className="text-sm text-slate-500">{seleccionado.trackingCode}</p>
                    </div>
                    <button
                      onClick={() => setSeleccionado(null)}
                      className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {seleccionado.estado && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor(seleccionado.estado.nombre)}`}>
                        {seleccionado.estado.nombre}
                      </span>
                    )}
                    {seleccionado.courier && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                        {seleccionado.courier.nombre} ({seleccionado.courier.tipo})
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                      {seleccionado.pesoKg} kg
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {recorrido.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Recorrido del paquete</h4>
                      <div className="relative">
                        {recorrido.map((paso, i) => (
                          <div key={i} className="flex gap-3 relative">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm z-10">
                                {iconoLugar(paso.tipoLugar)}
                              </div>
                              {i < recorrido.length - 1 && (
                                <div className="w-0.5 bg-slate-200 flex-1 my-1" />
                              )}
                            </div>
                            <div className="pb-4 flex-1">
                              <p className="font-medium text-sm text-slate-700">{paso.nombre}</p>
                              <p className="text-xs text-slate-500">
                                {paso.ciudad}, {paso.pais}
                              </p>
                              <p className="text-xs text-slate-400">{paso.fecha}</p>
                              <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                {paso.tipoLugar === "Deposito" ? "Depósito" : "Aduana"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {seleccionado.incidencias.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Incidencias</h4>
                      <div className="space-y-2">
                        {seleccionado.incidencias.map((inc, i) => (
                          <div
                            key={i}
                            className="border border-slate-200 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gravedadColor(inc.gravedad)}`}>
                                {inc.gravedad}
                              </span>
                              <span className="text-sm font-medium text-slate-700">{inc.tipo}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{inc.descripcion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {seleccionado.direccion && (
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Dirección de entrega</h4>
                      <p className="text-sm text-slate-600">
                        {seleccionado.direccion.calle} {seleccionado.direccion.numero},{" "}
                        {seleccionado.direccion.ciudad}, {seleccionado.direccion.provincia}
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
