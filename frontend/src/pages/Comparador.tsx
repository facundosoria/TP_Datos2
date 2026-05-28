import { useState, useEffect } from "react";
import { api } from "../services/api";

type Producto = {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
};

type Resultado = {
  producto: string;
  tienda: string;
  paisOrigen: string;
  precioProducto: number;
  costoEnvio: number;
  diasEnvio: number;
  moneda: string;
  porcentajeArancel: number;
  courier: string;
  costoBaseArs: number;
  arancelArs: number;
  costoFinalArs: number;
};

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

export default function Comparador() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/productos")
      .then((r) => {
        setProductos(r.data);
        if (r.data.length > 0) setNombre(r.data[0].nombre);
      })
      .catch(() => setError("Error al cargar productos"))
      .finally(() => setLoadingProductos(false));
  }, []);

  useEffect(() => {
    if (nombre) buscar();
  }, [nombre]);

  const buscar = async () => {
    if (!nombre) return;
    setLoading(true);
    setError(null);
    try {
      const r = await api.get(`/analitica/comparar-costos/${encodeURIComponent(nombre)}`);
      setResultados(r.data);
    } catch {
      setError("Error al buscar. ¿Está el backend corriendo?");
    } finally {
      setLoading(false);
    }
  };

  const productoSeleccionado = productos.find((p) => p.nombre === nombre);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Comparador de Costos</h2>
        <p className="text-slate-500 text-sm mt-1">
          Calculá el costo final en ARS incluyendo envío y aranceles
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Seleccioná un producto
        </label>
        {loadingProductos ? (
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <select
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {productos.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre} — {p.marca}
                {p.categoria ? ` (${p.categoria})` : ""}
              </option>
            ))}
          </select>
        )}
        {productoSeleccionado && (
          <p className="text-xs text-slate-400 mt-2">
            Marca: {productoSeleccionado.marca} • Categoría: {productoSeleccionado.categoria || "—"}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-lg p-4 text-sm">{error}</div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && nombre && resultados.length === 0 && (
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-sm">
          No se encontraron ofertas para este producto.
        </div>
      )}

      {!loading && resultados.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-700">{resultados.length} ofertas para</h3>
            <span className="bg-indigo-100 text-indigo-700 text-sm px-2 py-0.5 rounded-full font-medium">
              {resultados[0].producto}
            </span>
          </div>

          <div className="space-y-3">
            {resultados.map((r, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border p-5 ${
                  i === 0 ? "border-green-300 ring-1 ring-green-200" : "border-slate-200"
                }`}
              >
                {i === 0 && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full mb-3">
                    ✓ Mejor precio
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-800">{r.tienda}</p>
                    <p className="text-sm text-slate-500">{r.paisOrigen} • {r.courier}</p>
                    <p className="text-xs text-slate-400 mt-1">{r.diasEnvio} días de envío</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-xs text-slate-400">Precio</p>
                      <p className="text-sm font-medium text-slate-700">
                        {r.moneda} {r.precioProducto}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Envío</p>
                      <p className="text-sm font-medium text-slate-700">
                        {r.moneda} {r.costoEnvio}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Arancel</p>
                      <p className="text-sm font-medium text-orange-600">
                        {r.porcentajeArancel}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total ARS</p>
                      <p className="text-base font-bold text-slate-800">
                        {formatARS(r.costoFinalArs)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs text-slate-500">
                  <span>Base: {formatARS(r.costoBaseArs)}</span>
                  <span>Arancel: {formatARS(r.arancelArs)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
