import { Router, Request, Response } from "express";
import {
  getGrafoDatos,
  getGrafoRedCouriers,
  getGrafoCadenaProductos,
  getGrafoFlujoClientes,
} from "../services/grafo.service";

const router = Router();

const handler = (fn: () => Promise<any>) => async (_req: Request, res: Response) => {
  try {
    res.json(await fn());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del grafo" });
  }
};

router.get("/datos",            handler(getGrafoDatos));
router.get("/red-couriers",     handler(getGrafoRedCouriers));
router.get("/cadena-productos", handler(getGrafoCadenaProductos));
router.get("/flujo-clientes",   handler(getGrafoFlujoClientes));

export default router;
