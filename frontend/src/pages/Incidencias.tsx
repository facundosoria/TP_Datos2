import { useEffect, useState } from "react";
import { api } from "../services/api";

type IncidenciaItem = {
  codigo: string;
  trackingCode: string;
  courier: string;
  incidencias: {
    tipo: string;
    descripcion: string;
    gravedad: string;
  }[];
};

type CourierStats = {
  courier: string;
  calificacion: number;
  cantIncidencias: number;
};

const gravedadColor = (g: string) => {
  if (g === "Alta") return "bg-red-100 text-red-700 border-red-200";
  if (g === "Media") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
};

export default function Incidencias() {
  const [paquetes, setPaquetes] = useState<IncidenciaItem[]>([]);
  const [couriers, setCouriers] = useState<CourierStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          api.get("/paquetes"),
          api.get("/analitica/couriers-incidencias"),
        ]);
        const conIncidencias = p.data
          .filter((pk: any) => pk.cantIncidencias > 0)
          .map(async (pk: any) => {
            const detalle = await api.get(`/paquetes/${pk.codigo}`);
            return {
              codigo: pk.codigo,
              trackingCode: pk.trackingCode,
              courier: pk.courier,
              incidencias: detalle.data.incidencias || [],
            };
          });
        const resueltos = await Promise.all(conIncidencias);
        setPaquetes(resueltos);
        setCouriers(c.data);
      } catch {
        setError("Error al cargar incidencias");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalIncidencias = paquetes.reduce((sum, p) => sum + p.incidencias.length, 0);

  if (loading) return <div className="p-8 text-slate-500">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Incidencias</h2>
        <p className="text-slate-500 text-sm mt-1">
          {totalIncidencias} incidencia{totalIncidencias !== 1 ? "s" : ""} en {paquetes.length} paquete{paquetes.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {paquetes.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 font-medium">Sin incidencias registradas</p>
              <p className="text-green-600 text-sm mt-1">Todos los paquetes están en orden</p>
            </div>
          ) : (
            paquetes.map((p) => (
              <div key={p.codigo} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center text-base">
                    ⚠️
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{p.codigo}</p>
                    <p className="text-xs text-slate-500">
                      {p.trackingCode} • {p.courier}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {p.incidencias.map((inc, i) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-3 ${gravedadColor(inc.gravedad)}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{inc.tipo}</span>
                        <span className="text-xs font-medium opacity-75">{inc.gravedad}</span>
                      </div>
                      <p className="text-xs opacity-80">{inc.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Ranking de Couriers</h3>
            {couriers.length === 0 ? (
              <p className="text-slate-400 text-sm">Sin datos</p>
            ) : (
              <div className="space-y-4">
                {couriers.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">{i + 1}.</span>
                        <span className="text-sm font-medium text-slate-700">{c.courier}</span>
                      </div>
                      <span className="text-xs text-slate-500">⭐ {c.calificacion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-red-400 h-1.5 rounded-full"
                          style={{
                            width: `${(c.cantIncidencias / (couriers[0]?.cantIncidencias || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-4 text-right">{c.cantIncidencias}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
