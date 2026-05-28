import { Request, Response } from "express";
import {
  getAllProductos,
  getProductoById,
  getOfertasByProductoNombre,
  crearProducto,
} from "../services/producto.service";

export const listarProductos = async (_req: Request, res: Response) => {
  try {
    const data = await getAllProductos();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

export const obtenerProducto = async (req: Request, res: Response) => {
  try {
    const data = await getProductoById(req.params.id);
    if (!data) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto", error });
  }
};

export const ofertasDeProducto = async (req: Request, res: Response) => {
  try {
    const nombre = decodeURIComponent(req.params.nombre);
    const data = await getOfertasByProductoNombre(nombre);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener ofertas", error });
  }
};

export const nuevoProducto = async (req: Request, res: Response) => {
  try {
    const data = await crearProducto(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto", error });
  }
};
