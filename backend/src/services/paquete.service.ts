import { getSession } from "../config/neo4j.config";

export const getAllPaquetes = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Paquete)
      OPTIONAL MATCH (p)-[:TRANSPORTADO_POR]->(c:Courier)
      OPTIONAL MATCH (p)-[:TIENE_ESTADO]->(e:EstadoEnvio)
      OPTIONAL MATCH (p)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      OPTIONAL MATCH (:Orden)-[:GENERA_PAQUETE]->(p)<-[:GENERA]-(:Compra)<-[:REALIZA]-(cli:Cliente)
      RETURN p, c.nombre AS courier, e.nombre AS estado,
             count(i) AS cantIncidencias, cli.nombre AS cliente
      ORDER BY p.fechaCreacion DESC
    `);
    return result.records.map((r) => ({
      ...r.get("p").properties,
      courier: r.get("courier"),
      estado: r.get("estado"),
      cantIncidencias: Number(r.get("cantIncidencias")),
      cliente: r.get("cliente"),
    }));
  } finally {
    await session.close();
  }
};

export const getPaqueteByCodigo = async (codigo: string) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (p:Paquete {codigo: $codigo})
      OPTIONAL MATCH (p)-[:TRANSPORTADO_POR]->(c:Courier)
      OPTIONAL MATCH (p)-[:TIENE_ESTADO]->(e:EstadoEnvio)
      OPTIONAL MATCH (p)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      OPTIONAL MATCH (p)-[:ENTREGADO_EN]->(d:DireccionEntrega)
      OPTIONAL MATCH (:Orden)-[:GENERA_PAQUETE]->(p)<-[:GENERA]-(:Compra)<-[:REALIZA]-(cli:Cliente)
      RETURN p, c AS courier, e AS estado,
             collect(DISTINCT i) AS incidencias, d AS direccion, cli.nombre AS cliente
      `,
      { codigo }
    );
    if (result.records.length === 0) return null;
    const r = result.records[0];
    return {
      ...r.get("p").properties,
      courier: r.get("courier")?.properties,
      estado: r.get("estado")?.properties,
      incidencias: r.get("incidencias").map((i: any) => i.properties),
      direccion: r.get("direccion")?.properties,
      cliente: r.get("cliente"),
    };
  } finally {
    await session.close();
  }
};

export const getRecorridoPaquete = async (codigo: string) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (p:Paquete {codigo: $codigo})-[r:PASA_POR]->(lugar)
      RETURN
        labels(lugar)[0] AS tipoLugar,
        lugar.nombre AS nombre,
        lugar.ciudad AS ciudad,
        lugar.pais AS pais,
        r.fecha AS fecha,
        r.orden AS orden
      ORDER BY r.orden
      `,
      { codigo }
    );
    return result.records.map((r) => {
      const fecha = r.get("fecha");
      return {
        tipoLugar: r.get("tipoLugar"),
        nombre: r.get("nombre"),
        ciudad: r.get("ciudad"),
        pais: r.get("pais"),
        fecha: fecha ? `${fecha.year}-${String(fecha.month).padStart(2,"0")}-${String(fecha.day).padStart(2,"0")}` : null,
        orden: Number(r.get("orden")),
      };
    });
  } finally {
    await session.close();
  }
};

export const getPaquetesRetenidos = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Paquete)-[:TIENE_ESTADO]->(e:EstadoEnvio {nombre: "Retenido en aduana"})
      OPTIONAL MATCH (p)-[:TRANSPORTADO_POR]->(c:Courier)
      OPTIONAL MATCH (p)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      OPTIONAL MATCH (:DeclaracionJurada)-[:CORRESPONDE_A]->(p)
      RETURN p, c.nombre AS courier, collect(i) AS incidencias,
             exists((p)<-[:CORRESPONDE_A]-(:DeclaracionJurada)) AS tieneDeclaracion
    `);
    return result.records.map((r) => ({
      ...r.get("p").properties,
      courier: r.get("courier"),
      incidencias: r.get("incidencias").map((i: any) => i.properties),
      tieneDeclaracion: r.get("tieneDeclaracion"),
    }));
  } finally {
    await session.close();
  }
};
