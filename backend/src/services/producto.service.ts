import { getSession } from "../config/neo4j.config";

export const getAllProductos = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (p:Producto)
      OPTIONAL MATCH (p)-[:PERTENECE_A]->(c:CategoriaProducto)
      RETURN p, c.nombre AS categoria
      ORDER BY p.nombre
    `);
    return result.records.map((r) => ({
      ...r.get("p").properties,
      categoria: r.get("categoria"),
    }));
  } finally {
    await session.close();
  }
};

export const getProductoById = async (id: string) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (p:Producto {id: $id})
      OPTIONAL MATCH (p)-[:PERTENECE_A]->(c:CategoriaProducto)
      OPTIONAL MATCH (p)-[:TIENE_OFERTA]->(o:OfertaProducto)-[:VENDIDA_POR]->(t:TiendaExterior)
      OPTIONAL MATCH (o)-[:USA_MONEDA]->(m:Moneda)
      OPTIONAL MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)
      RETURN p, c.nombre AS categoria,
             collect({
               oferta: o,
               tienda: t.nombre,
               moneda: m.codigo,
               envio: e
             }) AS ofertas
      `,
      { id }
    );
    if (result.records.length === 0) return null;
    const r = result.records[0];
    return {
      ...r.get("p").properties,
      categoria: r.get("categoria"),
      ofertas: r.get("ofertas").map((o: any) => ({
        ...o.oferta?.properties,
        tienda: o.tienda,
        moneda: o.moneda,
        envio: o.envio?.properties,
      })),
    };
  } finally {
    await session.close();
  }
};

export const getOfertasByProductoNombre = async (nombre: string) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (p:Producto {nombre: $nombre})-[:TIENE_OFERTA]->(o:OfertaProducto)
      MATCH (o)-[:VENDIDA_POR]->(t:TiendaExterior)-[:UBICADA_EN]->(pais:PaisOrigen)
      MATCH (o)-[:USA_MONEDA]->(m:Moneda)
      MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)-[:OPERADO_POR]->(c:Courier)
      RETURN o, t.nombre AS tienda, pais.nombre AS pais, m.codigo AS moneda,
             e.costo AS costoEnvio, e.diasEstimados AS diasEnvio, c.nombre AS courier
      ORDER BY o.precio ASC
      `,
      { nombre }
    );
    return result.records.map((r) => ({
      ...r.get("o").properties,
      tienda: r.get("tienda"),
      pais: r.get("pais"),
      moneda: r.get("moneda"),
      costoEnvio: Number(r.get("costoEnvio")),
      diasEnvio: Number(r.get("diasEnvio")),
      courier: r.get("courier"),
    }));
  } finally {
    await session.close();
  }
};

export const crearProducto = async (data: {
  id: string;
  nombre: string;
  marca: string;
  modelo: string;
  descripcion: string;
}) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      CREATE (p:Producto {
        id: $id,
        nombre: $nombre,
        marca: $marca,
        modelo: $modelo,
        descripcion: $descripcion
      })
      RETURN p
      `,
      data
    );
    return result.records[0].get("p").properties;
  } finally {
    await session.close();
  }
};
