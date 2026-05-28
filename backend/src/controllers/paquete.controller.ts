import { Request, Response } from "express";
import {
  getAllPaquetes,
  getPaqueteByCodigo,
  getRecorridoPaquete,
  getPaquetesRetenidos,
} from "../services/paquete.service";

export const listarPaquetes = async (_req: Request, res: Response) => {
  try {
    const data = await getAllPaquetes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener paquetes", error });
  }
};

export const obtenerPaquete = async (req: Request, res: Response) => {
  try {
    const data = await getPaqueteByCodigo(req.params.codigo);
    if (!data) return res.status(404).json({ message: "Paquete no encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener paquete", error });
  }
};

export const recorridoPaquete = async (req: Request, res: Response) => {
  try {
    const data = await getRecorridoPaquete(req.params.codigo);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener recorrido", error });
  }
};

export const paquetesRetenidos = async (_req: Request, res: Response) => {
  try {
    const data = await getPaquetesRetenidos();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener paquetes retenidos", error });
  }
};
