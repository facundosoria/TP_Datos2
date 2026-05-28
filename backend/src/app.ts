import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import productoRoutes from "./routes/producto.routes";
import paqueteRoutes from "./routes/paquete.routes";
import analiticaRoutes from "./routes/analitica.routes";
import grafoRoutes from "./routes/grafo.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/paquetes", paqueteRoutes);
app.use("/api/analitica", analiticaRoutes);
app.use("/api/grafo", grafoRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
