import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Comparador from "./pages/Comparador";
import Paquetes from "./pages/Paquetes";
import Incidencias from "./pages/Incidencias";
import Grafo from "./pages/Grafo";
import Analitica from "./pages/Analitica";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas — requieren token */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <div className="flex h-screen overflow-hidden">
                  <Navbar />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/productos" element={<Productos />} />
                      <Route path="/comparador" element={<Comparador />} />
                      <Route path="/paquetes" element={<Paquetes />} />
                      <Route path="/incidencias" element={<Incidencias />} />
                      <Route path="/grafo" element={<Grafo />} />
                      <Route path="/analitica" element={<Analitica />} />
                    </Routes>
                  </main>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
