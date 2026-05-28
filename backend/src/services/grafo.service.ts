import { getSession } from "../config/neo4j.config";

export const getGrafoDatos = async () => {
  const session = getSession();
  try {
    const result = await session.run(`
      MATCH (n)-[r]->(m)
      WHERE NOT n:Cotizacion AND NOT m:Cotizacion
        AND NOT n:Pago AND NOT m:Pago
        AND NOT n:Impuesto AND NOT m:Impuesto
      RETURN
        labels(n)[0]                                        AS fromLabel,
        COALESCE(n.id, n.codigo)                            AS fromId,
        COALESCE(n.nombre, n.codigo, n.id, "")             AS fromName,
        type(r)                                             AS relType,
        labels(m)[0]                                        AS toLabel,
        COALESCE(m.id, m.codigo)                            AS toId,
        COALESCE(m.nombre, m.codigo, m.id, "")             AS toName
      LIMIT 800
    `);

    const nodesMap = new Map<string, { id: string; label: string; name: string }>();
    const links: { source: string; target: string; type: string }[] = [];

    for (const record of result.records) {
      const fromId    = record.get("fromId");
      const fromLabel = record.get("fromLabel");
      const fromName  = record.get("fromName");
      const toId      = record.get("toId");
      const toLabel   = record.get("toLabel");
      const toName    = record.get("toName");
      const relType   = record.get("relType");

      if (fromId && !nodesMap.has(fromId)) {
        nodesMap.set(fromId, { id: fromId, label: fromLabel, name: fromName });
      }
      if (toId && !nodesMap.has(toId)) {
        nodesMap.set(toId, { id: toId, label: toLabel, name: toName });
      }
      if (fromId && toId) {
        links.push({ source: fromId, target: toId, type: relType });
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    };
  } finally {
    await session.close();
  }
};
