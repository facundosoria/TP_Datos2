import { Router } from "express";
import {
  listarProductos,
  obtenerProducto,
  ofertasDeProducto,
  nuevoProducto,
} from "../controllers/producto.controller";

const router = Router();

router.get("/", listarProductos);
router.get("/:id", obtenerProducto);
router.post("/", nuevoProducto);
router.get("/:nombre/ofertas", ofertasDeProducto);

export default router;
