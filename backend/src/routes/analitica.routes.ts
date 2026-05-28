import { Router } from "express";
import {
  compararCostos,
  couriersIncidencias,
  productosRetenidos,
  paisesIncidencias,
  dashboardStats,
  mejorProveedorCategoria,
  eficienciaCouriers,
  impactoArancelario,
  riesgoPaises,
  perfilClientes,
} from "../controllers/analitica.controller";

const router = Router();

router.get("/comparar-costos/:nombreProducto", compararCostos);
router.get("/couriers-incidencias", couriersIncidencias);
router.get("/productos-retenidos", productosRetenidos);
router.get("/paises-incidencias", paisesIncidencias);
router.get("/dashboard-stats", dashboardStats);
router.get("/mejor-proveedor-categoria", mejorProveedorCategoria);
router.get("/eficiencia-couriers", eficienciaCouriers);
router.get("/impacto-arancelario", impactoArancelario);
router.get("/riesgo-paises", riesgoPaises);
router.get("/perfil-clientes", perfilClientes);

export default router;
