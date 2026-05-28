import { getSession } from "../config/neo4j.config";

export const compararCostosProducto = async (nombreProducto: string) => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (p:Producto {nombre: $nombreProducto})-[:TIENE_OFERTA]->(o:OfertaProducto)
      MATCH (o)-[:VENDIDA_POR]->(t:TiendaExterior)-[:UBICADA_EN]->(pais:PaisOrigen)
      MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)-[:OPERADO_POR]->(c:Courier)
      MATCH (o)-[:USA_MONEDA]->(m:Moneda)-[:TIENE_COTIZACION]->(cot:Cotizacion {monedaDestino: "ARS"})
      MATCH (p)-[:PERTENECE_A]->(cat:CategoriaProducto)-[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
      OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->(aPais:TarifaArancelariaPais {categoriaId: cat.id})
      WITH p, o, t, pais, e, m, cot, c,
           COALESCE(aPais.porcentaje, aBase.porcentaje) AS porcentajeArancel,
           ((o.precio + e.costo) * cot.valor) AS costoBaseArs
      RETURN
        p.nombre AS producto,
        t.nombre AS tienda,
        pais.nombre AS paisOrigen,
        o.precio AS precioProducto,
        e.costo AS costoEnvio,
        e.diasEstimados AS diasEnvio,
        m.codigo AS moneda,
        porcentajeArancel,
        c.nombre AS courier,
        costoBaseArs,
        costoBaseArs * porcentajeArancel / 100 AS arancelArs,
        costoBaseArs + (costoBaseArs * porcentajeArancel / 100) AS costoFinalArs
      ORDER BY costoFinalArs ASC
      `,
      { nombreProducto }
    );
    return result.records.map((r) => ({
      producto: r.get("producto"),
      tienda: r.get("tienda"),
      paisOrigen: r.get("paisOrigen"),
      precioProducto: r.get("precioProducto"),
      costoEnvio: r.get("costoEnvio"),
      diasEnvio: Number(r.get("diasEnvio")),
      moneda: r.get("moneda"),
      porcentajeArancel: r.get("porcentajeArancel"),
      courier: r.get("courier"),
      costoBaseArs: Number(r.get("costoBaseArs")),
      arancelArs: Number(r.get("arancelArs")),
      costoFinalArs: Number(r.get("costoFinalArs")),
    }));
  } finally {
    await session.close();
  }
};

export const getCouriersConIncidencias = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (co:Courier)<-[:TRANSPORTADO_POR]-(p:Paquete)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      RETURN co.nombre AS courier, co.calificacion AS calificacion, count(i) AS cantIncidencias
      ORDER BY cantIncidencias DESC
    `);
    return result.records.map((r) => ({
      courier: r.get("courier"),
      calificacion: r.get("calificacion"),
      cantIncidencias: r.get("cantIncidencias").toNumber(),
    }));
  } finally {
    await session.close();
  }
};

export const getProductosRetenidos = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (prod:Producto)<-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(p:Paquete)-[:TIENE_ESTADO]->(e:EstadoEnvio {nombre: "Retenido en aduana"})
      RETURN prod.nombre AS producto, prod.marca AS marca, count(p) AS vecesRetenido
      ORDER BY vecesRetenido DESC
    `);
    return result.records.map((r) => ({
      producto: r.get("producto"),
      marca: r.get("marca"),
      vecesRetenido: r.get("vecesRetenido").toNumber(),
    }));
  } finally {
    await session.close();
  }
};

export const getPaisesConIncidencias = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (pais:PaisOrigen)<-[:UBICADA_EN]-(:TiendaExterior)<-[:VENDIDA_POR]-(o:OfertaProducto)<-[:TIENE_OFERTA]-(prod:Producto)<-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(p:Paquete)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      RETURN pais.nombre AS pais, pais.region AS region, count(i) AS cantIncidencias
      ORDER BY cantIncidencias DESC
    `);
    return result.records.map((r) => ({
      pais: r.get("pais"),
      region: r.get("region"),
      cantIncidencias: r.get("cantIncidencias").toNumber(),
    }));
  } finally {
    await session.close();
  }
};

export const getDashboardStats = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (compras:Compra) WITH count(compras) AS totalCompras
      MATCH (paq:Paquete)-[:TIENE_ESTADO]->(e:EstadoEnvio)
      WITH totalCompras,
           sum(CASE WHEN e.nombre = "En tránsito" THEN 1 ELSE 0 END) AS enTransito,
           sum(CASE WHEN e.nombre = "Retenido en aduana" THEN 1 ELSE 0 END) AS retenidos
      OPTIONAL MATCH (co:Courier)<-[:TRANSPORTADO_POR]-(p2:Paquete)-[:TIENE_INCIDENCIA]->(:Incidencia)
      WITH totalCompras, enTransito, retenidos, co.nombre AS courierNombre, count(*) AS incCourier
      ORDER BY incCourier DESC LIMIT 1
      RETURN totalCompras, enTransito, retenidos, courierNombre AS courierMasIncidencias
    `);
    if (result.records.length === 0) {
      return { totalCompras: 0, enTransito: 0, retenidos: 0, courierMasIncidencias: null };
    }
    const r = result.records[0];
    return {
      totalCompras: r.get("totalCompras").toNumber(),
      enTransito: r.get("enTransito").toNumber(),
      retenidos: r.get("retenidos").toNumber(),
      courierMasIncidencias: r.get("courierMasIncidencias"),
    };
  } finally {
    await session.close();
  }
};

// ── Consultas de gestión empresarial ─────────────────────────────────────────

export const getMejorProveedorCategoria = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (prod:Producto)-[:PERTENECE_A]->(cat:CategoriaProducto)
      MATCH (prod)-[:TIENE_OFERTA]->(o:OfertaProducto)-[:VENDIDA_POR]->(t:TiendaExterior)-[:UBICADA_EN]->(pais:PaisOrigen)
      MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)
      MATCH (o)-[:USA_MONEDA]->(m:Moneda)-[:TIENE_COTIZACION]->(cot:Cotizacion {monedaDestino: "ARS"})
      MATCH (cat)-[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
      OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->(aPais:TarifaArancelariaPais {categoriaId: cat.id})
      WITH cat, pais, t,
           COALESCE(aPais.porcentaje, aBase.porcentaje) AS arancel,
           avg((o.precio + e.costo) * cot.valor) AS costoBasePromedio
      WITH cat, pais, t, arancel,
           costoBasePromedio,
           costoBasePromedio * (1 + arancel / 100) AS costoFinalPromedio
      RETURN
        cat.nombre          AS categoria,
        pais.nombre         AS pais,
        t.nombre            AS tienda,
        round(arancel)      AS arancelPct,
        round(costoBasePromedio)  AS costoBaseArs,
        round(costoFinalPromedio) AS costoFinalArs
      ORDER BY categoria ASC, costoFinalArs ASC
    `);
    return result.records.map((r) => ({
      categoria:    r.get("categoria"),
      pais:         r.get("pais"),
      tienda:       r.get("tienda"),
      arancelPct:   r.get("arancelPct"),
      costoBaseArs: Number(r.get("costoBaseArs")),
      costoFinalArs:Number(r.get("costoFinalArs")),
    }));
  } finally {
    await session.close();
  }
};

export const getEficienciaCouriers = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (c:Courier)
      OPTIONAL MATCH (c)<-[:TRANSPORTADO_POR]-(p:Paquete)
      OPTIONAL MATCH (p)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      WITH c,
           count(DISTINCT p) AS totalPaquetes,
           count(DISTINCT i) AS totalIncidencias
      OPTIONAL MATCH (c)<-[:OPERADO_POR]-(e:MetodoEnvio)
      WITH c, totalPaquetes, totalIncidencias,
           avg(e.diasEstimados) AS diasPromedio
      RETURN
        c.nombre        AS courier,
        c.calificacion  AS calificacion,
        totalPaquetes,
        totalIncidencias,
        CASE WHEN totalPaquetes > 0
          THEN round(toFloat(totalIncidencias) / totalPaquetes * 100, 1)
          ELSE 0.0 END    AS tasaIncidenciasPct,
        round(diasPromedio, 1) AS diasPromedioEnvio,
        round(c.calificacion * (1 - toFloat(totalIncidencias) / (totalPaquetes + 1)), 2) AS scoreEficiencia
      ORDER BY scoreEficiencia DESC
    `);
    return result.records.map((r) => ({
      courier:           r.get("courier"),
      calificacion:      r.get("calificacion"),
      totalPaquetes:     r.get("totalPaquetes").toNumber(),
      totalIncidencias:  r.get("totalIncidencias").toNumber(),
      tasaIncidenciasPct:r.get("tasaIncidenciasPct"),
      diasPromedioEnvio: r.get("diasPromedioEnvio"),
      scoreEficiencia:   r.get("scoreEficiencia"),
    }));
  } finally {
    await session.close();
  }
};

export const getImpactoArancelario = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (prod:Producto)-[:PERTENECE_A]->(cat:CategoriaProducto)
      MATCH (prod)-[:TIENE_OFERTA]->(o:OfertaProducto)-[:VENDIDA_POR]->(t:TiendaExterior)-[:UBICADA_EN]->(pais:PaisOrigen)
      MATCH (o)-[:TIENE_ENVIO]->(e:MetodoEnvio)
      MATCH (o)-[:USA_MONEDA]->(m:Moneda)-[:TIENE_COTIZACION]->(cot:Cotizacion {monedaDestino: "ARS"})
      MATCH (cat)-[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
      OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->(aPais:TarifaArancelariaPais {categoriaId: cat.id})
      WITH cat,
           COALESCE(aPais.porcentaje, aBase.porcentaje) AS arancel,
           (o.precio + e.costo) * cot.valor AS costoBase
      WITH cat,
           count(*)                        AS cantOfertas,
           round(avg(arancel), 1)          AS arancelPromedio,
           round(min(arancel), 1)          AS arancelMin,
           round(max(arancel), 1)          AS arancelMax,
           round(avg(costoBase))           AS costoBasePromArs,
           round(avg(costoBase * arancel / 100)) AS arancelPromArs,
           round(avg(costoBase * (1 + arancel / 100))) AS costoFinalPromArs
      RETURN
        cat.nombre        AS categoria,
        cantOfertas,
        arancelPromedio, arancelMin, arancelMax,
        costoBasePromArs, arancelPromArs, costoFinalPromArs,
        round(toFloat(arancelPromArs) / costoFinalPromArs * 100, 1) AS pctArancelSobreFinal
      ORDER BY pctArancelSobreFinal DESC
    `);
    return result.records.map((r) => ({
      categoria:          r.get("categoria"),
      cantOfertas:        r.get("cantOfertas").toNumber(),
      arancelPromedio:    r.get("arancelPromedio"),
      arancelMin:         r.get("arancelMin"),
      arancelMax:         r.get("arancelMax"),
      costoBasePromArs:   Number(r.get("costoBasePromArs")),
      arancelPromArs:     Number(r.get("arancelPromArs")),
      costoFinalPromArs:  Number(r.get("costoFinalPromArs")),
      pctArancelSobreFinal: r.get("pctArancelSobreFinal"),
    }));
  } finally {
    await session.close();
  }
};

export const getRiesgoPaises = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (pais:PaisOrigen)
      OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)<-[:VENDIDA_POR]-(:OfertaProducto)
             <-[:TIENE_OFERTA]-(prod:Producto)-[:PERTENECE_A]->(cat:CategoriaProducto)
             -[:APLICA_ARANCEL]->(aBase:TarifaArancelaria)
      OPTIONAL MATCH (pais)-[:TIENE_TARIFA_PAIS]->(aPais:TarifaArancelariaPais {categoriaId: cat.id})
      WITH pais, avg(COALESCE(aPais.porcentaje, aBase.porcentaje)) AS arancelPromedio
      OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)<-[:VENDIDA_POR]-(:OfertaProducto)
             <-[:TIENE_OFERTA]-(:Producto)<-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]->(p:Paquete)
      WITH pais, arancelPromedio, count(DISTINCT p) AS totalPaquetes
      OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)<-[:VENDIDA_POR]-(:OfertaProducto)
             <-[:TIENE_OFERTA]-(:Producto)<-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]
             ->(pr:Paquete)-[:TIENE_ESTADO]->(:EstadoEnvio {nombre: "Retenido en aduana"})
      WITH pais, arancelPromedio, totalPaquetes, count(DISTINCT pr) AS paquetesRetenidos
      OPTIONAL MATCH (pais)<-[:UBICADA_EN]-(:TiendaExterior)<-[:VENDIDA_POR]-(:OfertaProducto)
             <-[:TIENE_OFERTA]-(:Producto)<-[:INCLUYE]-(:Orden)-[:GENERA_PAQUETE]
             ->(pi:Paquete)-[:TIENE_INCIDENCIA]->(:Incidencia)
      WITH pais, arancelPromedio, totalPaquetes, paquetesRetenidos,
           count(DISTINCT pi) AS paquetesConIncidencia
      RETURN
        pais.nombre   AS pais,
        pais.region   AS region,
        round(arancelPromedio, 1)  AS arancelPromPct,
        totalPaquetes,
        paquetesRetenidos,
        paquetesConIncidencia,
        CASE WHEN totalPaquetes > 0
          THEN round(toFloat(paquetesRetenidos) / totalPaquetes * 100, 1)
          ELSE 0.0 END  AS tasaRetencionPct
      ORDER BY arancelPromPct DESC, tasaRetencionPct DESC
    `);
    return result.records.map((r) => ({
      pais:                 r.get("pais"),
      region:               r.get("region"),
      arancelPromPct:       r.get("arancelPromPct"),
      totalPaquetes:        r.get("totalPaquetes").toNumber(),
      paquetesRetenidos:    r.get("paquetesRetenidos").toNumber(),
      paquetesConIncidencia:r.get("paquetesConIncidencia").toNumber(),
      tasaRetencionPct:     r.get("tasaRetencionPct"),
    }));
  } finally {
    await session.close();
  }
};

export const getPerfilClientes = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (cli:Cliente)-[:REALIZA]->(com:Compra)
      WITH cli, count(DISTINCT com) AS totalCompras
      OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(p:Paquete)
      WITH cli, totalCompras, count(DISTINCT p) AS totalPaquetes
      OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pr:Paquete)
             -[:TIENE_ESTADO]->(:EstadoEnvio {nombre: "Retenido en aduana"})
      WITH cli, totalCompras, totalPaquetes, count(DISTINCT pr) AS paquetesRetenidos
      OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pi:Paquete)-[:TIENE_INCIDENCIA]->(i:Incidencia)
      WITH cli, totalCompras, totalPaquetes, paquetesRetenidos,
           count(DISTINCT i) AS totalIncidencias
      OPTIONAL MATCH (cli)-[:REALIZA]->(:Compra)-[:GENERA]->(pc:Paquete)-[:TRANSPORTADO_POR]->(c:Courier)
      WITH cli, totalCompras, totalPaquetes, paquetesRetenidos, totalIncidencias,
           avg(c.calificacion) AS calCourier
      RETURN
        cli.nombre    AS cliente,
        cli.email     AS email,
        totalCompras, totalPaquetes, paquetesRetenidos, totalIncidencias,
        round(calCourier, 2) AS calCourierProm,
        CASE WHEN totalPaquetes > 0
          THEN round(toFloat(paquetesRetenidos) / totalPaquetes * 100, 1)
          ELSE 0.0 END  AS tasaProblemasPct
      ORDER BY totalCompras DESC, totalIncidencias DESC
    `);
    return result.records.map((r) => ({
      cliente:           r.get("cliente"),
      email:             r.get("email"),
      totalCompras:      r.get("totalCompras").toNumber(),
      totalPaquetes:     r.get("totalPaquetes").toNumber(),
      paquetesRetenidos: r.get("paquetesRetenidos").toNumber(),
      totalIncidencias:  r.get("totalIncidencias").toNumber(),
      calCourierProm:    r.get("calCourierProm"),
      tasaProblemasPct:  r.get("tasaProblemasPct"),
    }));
  } finally {
    await session.close();
  }
};
