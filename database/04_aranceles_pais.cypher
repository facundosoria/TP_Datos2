// ============================================================
// 04_aranceles_pais.cypher — Tarifas arancelarias por país
// Ejecutar DESPUÉS de 03_more_data.cypher (no borra nada)
//
// Modelo: PaisOrigen -[:TIENE_TARIFA_PAIS]-> TarifaArancelariaPais
// La query del comparador usa OPTIONAL MATCH + COALESCE para
// tomar la tasa país-específica cuando existe, y caer al base
// de categoría cuando no hay una específica.
//
// Libros (CAT-005) siempre 0% por Ley 25.446 — no se crean
// tarifas específicas para ningún país en esa categoría.
//
// Bases TEC (Tarifa Externa Común Mercosur):
//   Electrónica 16% | Ropa 35% | Calzado 22%
//   Juguetes 20%    | Libros 0% | Herramientas 14%
// ============================================================

MATCH (cn:PaisOrigen {codigo: "CN"})
MATCH (de:PaisOrigen {codigo: "DE"})
MATCH (fr:PaisOrigen {codigo: "FR"})
MATCH (es:PaisOrigen {codigo: "ES"})
MATCH (uk:PaisOrigen {codigo: "UK"})
MATCH (us:PaisOrigen {codigo: "US"})
MATCH (jp:PaisOrigen {codigo: "JP"})

WITH *

// ============================================================
// ELECTRÓNICA (CAT-001) — base TEC: 16%
// ============================================================

CREATE (tap_elec_cn:TarifaArancelariaPais {
  id: "TAP-001", categoriaId: "CAT-001", porcentaje: 35.0,
  descripcion: "Electrónica China — sobrearancel antidumping Res. MEFP 636/2023"
})
CREATE (tap_elec_jp:TarifaArancelariaPais {
  id: "TAP-002", categoriaId: "CAT-001", porcentaje: 20.0,
  descripcion: "Electrónica Japón — Asia sin acuerdo preferencial"
})
CREATE (tap_elec_uk:TarifaArancelariaPais {
  id: "TAP-003", categoriaId: "CAT-001", porcentaje: 14.0,
  descripcion: "Electrónica Reino Unido — preferencia post-Brexit parcial"
})
CREATE (tap_elec_de:TarifaArancelariaPais {
  id: "TAP-004", categoriaId: "CAT-001", porcentaje: 12.0,
  descripcion: "Electrónica Alemania — preferencia Mercosur-UE"
})
CREATE (tap_elec_fr:TarifaArancelariaPais {
  id: "TAP-005", categoriaId: "CAT-001", porcentaje: 12.0,
  descripcion: "Electrónica Francia — preferencia Mercosur-UE"
})
CREATE (tap_elec_es:TarifaArancelariaPais {
  id: "TAP-006", categoriaId: "CAT-001", porcentaje: 12.0,
  descripcion: "Electrónica España — preferencia Mercosur-UE"
})

// ============================================================
// ROPA (CAT-002) — base TEC: 35%
// ============================================================

CREATE (tap_ropa_cn:TarifaArancelariaPais {
  id: "TAP-007", categoriaId: "CAT-002", porcentaje: 52.0,
  descripcion: "Indumentaria China — antidumping textiles confeccionados"
})
CREATE (tap_ropa_jp:TarifaArancelariaPais {
  id: "TAP-008", categoriaId: "CAT-002", porcentaje: 38.0,
  descripcion: "Indumentaria Japón — Asia sin acuerdo preferencial"
})
CREATE (tap_ropa_uk:TarifaArancelariaPais {
  id: "TAP-009", categoriaId: "CAT-002", porcentaje: 30.0,
  descripcion: "Indumentaria Reino Unido — preferencia post-Brexit parcial"
})
CREATE (tap_ropa_de:TarifaArancelariaPais {
  id: "TAP-010", categoriaId: "CAT-002", porcentaje: 26.0,
  descripcion: "Indumentaria Alemania — preferencia Mercosur-UE"
})
CREATE (tap_ropa_fr:TarifaArancelariaPais {
  id: "TAP-011", categoriaId: "CAT-002", porcentaje: 26.0,
  descripcion: "Indumentaria Francia — preferencia Mercosur-UE"
})
CREATE (tap_ropa_es:TarifaArancelariaPais {
  id: "TAP-012", categoriaId: "CAT-002", porcentaje: 26.0,
  descripcion: "Indumentaria España — preferencia Mercosur-UE"
})

// ============================================================
// CALZADO (CAT-003) — base TEC: 22%
// ============================================================

CREATE (tap_calz_cn:TarifaArancelariaPais {
  id: "TAP-013", categoriaId: "CAT-003", porcentaje: 35.0,
  descripcion: "Calzado China — antidumping Res. MEFP 442/2022"
})
CREATE (tap_calz_jp:TarifaArancelariaPais {
  id: "TAP-014", categoriaId: "CAT-003", porcentaje: 26.0,
  descripcion: "Calzado Japón — Asia sin acuerdo preferencial"
})
CREATE (tap_calz_fr:TarifaArancelariaPais {
  id: "TAP-015", categoriaId: "CAT-003", porcentaje: 14.0,
  descripcion: "Calzado Francia — preferencia Mercosur-UE, marcas premium"
})
CREATE (tap_calz_de:TarifaArancelariaPais {
  id: "TAP-016", categoriaId: "CAT-003", porcentaje: 16.0,
  descripcion: "Calzado Alemania — preferencia Mercosur-UE"
})
CREATE (tap_calz_es:TarifaArancelariaPais {
  id: "TAP-017", categoriaId: "CAT-003", porcentaje: 16.0,
  descripcion: "Calzado España — preferencia Mercosur-UE"
})

// ============================================================
// JUGUETES (CAT-004) — base TEC: 20%
// ============================================================

CREATE (tap_jug_cn:TarifaArancelariaPais {
  id: "TAP-018", categoriaId: "CAT-004", porcentaje: 35.0,
  descripcion: "Juguetes China — antidumping máximo, clones y knockoffs"
})
CREATE (tap_jug_jp:TarifaArancelariaPais {
  id: "TAP-019", categoriaId: "CAT-004", porcentaje: 24.0,
  descripcion: "Juguetes Japón — Asia sin acuerdo preferencial"
})
CREATE (tap_jug_uk:TarifaArancelariaPais {
  id: "TAP-020", categoriaId: "CAT-004", porcentaje: 18.0,
  descripcion: "Juguetes Reino Unido — preferencia post-Brexit parcial"
})
CREATE (tap_jug_de:TarifaArancelariaPais {
  id: "TAP-021", categoriaId: "CAT-004", porcentaje: 15.0,
  descripcion: "Juguetes Alemania — preferencia Mercosur-UE"
})
CREATE (tap_jug_fr:TarifaArancelariaPais {
  id: "TAP-022", categoriaId: "CAT-004", porcentaje: 15.0,
  descripcion: "Juguetes Francia — preferencia Mercosur-UE"
})

// ============================================================
// HERRAMIENTAS (CAT-006) — base TEC: 14%
// ============================================================

CREATE (tap_herr_cn:TarifaArancelariaPais {
  id: "TAP-023", categoriaId: "CAT-006", porcentaje: 22.0,
  descripcion: "Herramientas China — antidumping herramientas eléctricas"
})
CREATE (tap_herr_jp:TarifaArancelariaPais {
  id: "TAP-024", categoriaId: "CAT-006", porcentaje: 18.0,
  descripcion: "Herramientas Japón — Asia sin acuerdo preferencial"
})
CREATE (tap_herr_us:TarifaArancelariaPais {
  id: "TAP-025", categoriaId: "CAT-006", porcentaje: 10.0,
  descripcion: "Herramientas USA — acuerdo sectorial herramientas industriales"
})
CREATE (tap_herr_de:TarifaArancelariaPais {
  id: "TAP-026", categoriaId: "CAT-006", porcentaje: 10.0,
  descripcion: "Herramientas Alemania — preferencia Mercosur-UE, precisión"
})
CREATE (tap_herr_fr:TarifaArancelariaPais {
  id: "TAP-027", categoriaId: "CAT-006", porcentaje: 12.0,
  descripcion: "Herramientas Francia — preferencia Mercosur-UE"
})
CREATE (tap_herr_uk:TarifaArancelariaPais {
  id: "TAP-028", categoriaId: "CAT-006", porcentaje: 12.0,
  descripcion: "Herramientas Reino Unido — preferencia post-Brexit parcial"
})

// ============================================================
// RELACIONES PaisOrigen -[:TIENE_TARIFA_PAIS]-> TarifaArancelariaPais
// ============================================================

// Electrónica
CREATE (cn)-[:TIENE_TARIFA_PAIS]->(tap_elec_cn)
CREATE (jp)-[:TIENE_TARIFA_PAIS]->(tap_elec_jp)
CREATE (uk)-[:TIENE_TARIFA_PAIS]->(tap_elec_uk)
CREATE (de)-[:TIENE_TARIFA_PAIS]->(tap_elec_de)
CREATE (fr)-[:TIENE_TARIFA_PAIS]->(tap_elec_fr)
CREATE (es)-[:TIENE_TARIFA_PAIS]->(tap_elec_es)

// Ropa
CREATE (cn)-[:TIENE_TARIFA_PAIS]->(tap_ropa_cn)
CREATE (jp)-[:TIENE_TARIFA_PAIS]->(tap_ropa_jp)
CREATE (uk)-[:TIENE_TARIFA_PAIS]->(tap_ropa_uk)
CREATE (de)-[:TIENE_TARIFA_PAIS]->(tap_ropa_de)
CREATE (fr)-[:TIENE_TARIFA_PAIS]->(tap_ropa_fr)
CREATE (es)-[:TIENE_TARIFA_PAIS]->(tap_ropa_es)

// Calzado
CREATE (cn)-[:TIENE_TARIFA_PAIS]->(tap_calz_cn)
CREATE (jp)-[:TIENE_TARIFA_PAIS]->(tap_calz_jp)
CREATE (fr)-[:TIENE_TARIFA_PAIS]->(tap_calz_fr)
CREATE (de)-[:TIENE_TARIFA_PAIS]->(tap_calz_de)
CREATE (es)-[:TIENE_TARIFA_PAIS]->(tap_calz_es)

// Juguetes
CREATE (cn)-[:TIENE_TARIFA_PAIS]->(tap_jug_cn)
CREATE (jp)-[:TIENE_TARIFA_PAIS]->(tap_jug_jp)
CREATE (uk)-[:TIENE_TARIFA_PAIS]->(tap_jug_uk)
CREATE (de)-[:TIENE_TARIFA_PAIS]->(tap_jug_de)
CREATE (fr)-[:TIENE_TARIFA_PAIS]->(tap_jug_fr)

// Herramientas
CREATE (cn)-[:TIENE_TARIFA_PAIS]->(tap_herr_cn)
CREATE (jp)-[:TIENE_TARIFA_PAIS]->(tap_herr_jp)
CREATE (us)-[:TIENE_TARIFA_PAIS]->(tap_herr_us)
CREATE (de)-[:TIENE_TARIFA_PAIS]->(tap_herr_de)
CREATE (fr)-[:TIENE_TARIFA_PAIS]->(tap_herr_fr)
CREATE (uk)-[:TIENE_TARIFA_PAIS]->(tap_herr_uk)
