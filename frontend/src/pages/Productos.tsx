import { useEffect, useState } from "react";
import { api } from "../services/api";

type Producto = {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
  categoria: string;
};

type Oferta = {
  id: string;
  precio: number;
  condicion: string;
  stockDisponible: boolean;
  tienda: string;
  pais: string;
  moneda: string;
  costoEnvio: number;
  diasEnvio: number;
  courier: string;
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loadingOfertas, setLoadingOfertas] = useState(false);

  useEffect(() => {
    api
      .get("/productos")
      .then((r) => setProductos(r.data))
      .catch(() => setError("Error al cargar productos"))
      .finally(() => setLoading(false));
  }, []);

  const verOfertas = async (p: Producto) => {
    setSeleccionado(p);
    setLoadingOfertas(true);
    try {
      const r = await api.get(`/productos/${encodeURIComponent(p.nombre)}/ofertas`);
      setOfertas(r.data);
    } catch {
      setOfertas([]);
    } finally {
      setLoadingOfertas(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Productos</h2>
        <p className="text-slate-500 text-sm mt-1">{productos.length} productos registrados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => verOfertas(p)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
                📦
              </div>
              {p.categoria && (
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                  {p.categoria}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">{p.nombre}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {p.marca} • {p.modelo}
            </p>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{p.descripcion}</p>
            <button className="mt-3 text-xs text-indigo-600 font-medium hover:text-indigo-800">
              Ver ofertas →
            </button>
          </div>
        ))}
      </div>

      {seleccionado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{seleccionado.nombre}</h3>
                  <p className="text-sm text-slate-500">
                    {seleccionado.marca} • {seleccionado.modelo}
                  </p>
                </div>
                <button
                  onClick={() => setSeleccionado(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {loadingOfertas ? (
                <p className="text-slate-400 text-sm">Cargando ofertas...</p>
              ) : ofertas.length === 0 ? (
                <p className="text-slate-400 text-sm">Sin ofertas registradas</p>
              ) : (
                <div className="space-y-3">
                  {ofertas.map((o) => (
                    <div
                      key={o.id}
                      className="border border-slate-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-slate-700">{o.tienda}</p>
                        <p className="text-xs text-slate-500">
                          {o.pais} • {o.courier} • {o.diasEnvio} días
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${o.stockDisponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {o.stockDisponible ? "En stock" : "Sin stock"}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {o.condicion}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800">
                          {o.moneda} {o.precio}
                        </p>
                        <p className="text-xs text-slate-500">+ envío {o.moneda} {o.costoEnvio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
