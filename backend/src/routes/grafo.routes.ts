import { Router, Request, Response } from "express";
import { getGrafoDatos } from "../services/grafo.service";

const router = Router();

router.get("/datos", async (_req: Request, res: Response) => {
  try {
    const data = await getGrafoDatos();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener datos del grafo" });
  }
});

export default router;
