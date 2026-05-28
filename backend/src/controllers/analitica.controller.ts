import { Request, Response } from "express";
import {
  compararCostosProducto,
  getCouriersConIncidencias,
  getProductosRetenidos,
  getPaisesConIncidencias,
  getDashboardStats,
  getMejorProveedorCategoria,
  getEficienciaCouriers,
  getImpactoArancelario,
  getRiesgoPaises,
  getPerfilClientes,
} from "../services/analitica.service";

export const compararCostos = async (req: Request, res: Response) => {
  try {
    const nombre = decodeURIComponent(req.params.nombreProducto);
    const data = await compararCostosProducto(nombre);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al comparar costos", error });
  }
};

export const couriersIncidencias = async (_req: Request, res: Response) => {
  try {
    const data = await getCouriersConIncidencias();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener couriers", error });
  }
};

export const productosRetenidos = async (_req: Request, res: Response) => {
  try {
    const data = await getProductosRetenidos();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos retenidos", error });
  }
};

export const paisesIncidencias = async (_req: Request, res: Response) => {
  try {
    const data = await getPaisesConIncidencias();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener países", error });
  }
};

export const dashboardStats = async (_req: Request, res: Response) => {
  try {
    const data = await getDashboardStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estadísticas", error });
  }
};

export const mejorProveedorCategoria = async (_req: Request, res: Response) => {
  try {
    res.json(await getMejorProveedorCategoria());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mejores proveedores", error });
  }
};

export const eficienciaCouriers = async (_req: Request, res: Response) => {
  try {
    res.json(await getEficienciaCouriers());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener eficiencia de couriers", error });
  }
};

export const impactoArancelario = async (_req: Request, res: Response) => {
  try {
    res.json(await getImpactoArancelario());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener impacto arancelario", error });
  }
};

export const riesgoPaises = async (_req: Request, res: Response) => {
  try {
    res.json(await getRiesgoPaises());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mapa de riesgo", error });
  }
};

export const perfilClientes = async (_req: Request, res: Response) => {
  try {
    res.json(await getPerfilClientes());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil de clientes", error });
  }
};
