import { useEffect, useState } from "react";
import { api } from "../services/api";
import StatCard from "../components/StatCard";

type Stats = {
  totalCompras: number;
  enTransito: number;
  retenidos: number;
  courierMasIncidencias: string | null;
};

type CourierItem = { courier: string; cantIncidencias: number };
type PaisItem = { pais: string; region: string; cantIncidencias: number };

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [couriers, setCouriers] = useState<CourierItem[]>([]);
  const [paises, setPaises] = useState<PaisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, p] = await Promise.all([
          api.get("/analitica/dashboard-stats"),
          api.get("/analitica/couriers-incidencias"),
          api.get("/analitica/paises-incidencias"),
        ]);
        setStats(s.data);
        setCouriers(c.data);
        setPaises(p.data);
      } catch {
        setError("Error al cargar el dashboard. ¿Está el backend corriendo?");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-8 text-slate-500">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-50 rounded-lg m-6">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Resumen del sistema de trazabilidad</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Compras"
          value={stats?.totalCompras ?? 0}
          icon="🛒"
          color="blue"
        />
        <StatCard
          title="En Tránsito"
          value={stats?.enTransito ?? 0}
          icon="🚚"
          color="green"
        />
        <StatCard
          title="Retenidos en Aduana"
          value={stats?.retenidos ?? 0}
          icon="🔒"
          color="red"
        />
        <StatCard
          title="Courier con más problemas"
          value={stats?.courierMasIncidencias ?? "—"}
          icon="⚠️"
          color="yellow"
          subtitle="mayor cantidad de incidencias"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Couriers con incidencias</h3>
          {couriers.length === 0 ? (
            <p className="text-slate-400 text-sm">Sin incidencias registradas</p>
          ) : (
            <div className="space-y-3">
              {couriers.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-5">{i + 1}.</span>
                    <span className="text-sm font-medium text-slate-700">{c.courier}</span>
                  </div>
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {c.cantIncidencias} incidencia{c.cantIncidencias !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Países con más incidencias</h3>
          {paises.length === 0 ? (
            <p className="text-slate-400 text-sm">Sin datos disponibles</p>
          ) : (
            <div className="space-y-3">
              {paises.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-5">{i + 1}.</span>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{p.pais}</span>
                      <span className="text-xs text-slate-400 ml-1">({p.region})</span>
                    </div>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {p.cantIncidencias} incidencia{p.cantIncidencias !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
