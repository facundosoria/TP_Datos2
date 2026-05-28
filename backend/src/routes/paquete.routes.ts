import { Router } from "express";
import {
  listarPaquetes,
  obtenerPaquete,
  recorridoPaquete,
  paquetesRetenidos,
} from "../controllers/paquete.controller";

const router = Router();

router.get("/", listarPaquetes);
router.get("/retenidos", paquetesRetenidos);
router.get("/:codigo", obtenerPaquete);
router.get("/:codigo/recorrido", recorridoPaquete);

export default router;
