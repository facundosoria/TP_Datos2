// ============================================================
// 06_fix_seed02.cypher
// Corrige las relaciones que fallaron en 02_seed_data.cypher
// porque las variables no persisten entre statements separados
// con ; en cypher-shell.
// Todos los statements usan MERGE — son idempotentes.
// ============================================================

// Aranceles base por categoria
MATCH (cat:CategoriaProducto {id:"CAT-001"}),(t:TarifaArancelaria {id:"TAR-001"}) MERGE (cat)-[:APLICA_ARANCEL]->(t);
MATCH (cat:CategoriaProducto {id:"CAT-002"}),(t:TarifaArancelaria {id:"TAR-002"}) MERGE (cat)-[:APLICA_ARANCEL]->(t);

// Productos -> categorias
MATCH (p:Producto {id:"PROD-001"}),(cat:CategoriaProducto {id:"CAT-001"}) MERGE (p)-[:PERTENECE_A]->(cat);
MATCH (p:Producto {id:"PROD-002"}),(cat:CategoriaProducto {id:"CAT-001"}) MERGE (p)-[:PERTENECE_A]->(cat);
MATCH (p:Producto {id:"PROD-003"}),(cat:CategoriaProducto {id:"CAT-002"}) MERGE (p)-[:PERTENECE_A]->(cat);

// Productos -> ofertas
MATCH (p:Producto {id:"PROD-001"}),(o:OfertaProducto {id:"OFE-001"}) MERGE (p)-[:TIENE_OFERTA]->(o);
MATCH (p:Producto {id:"PROD-001"}),(o:OfertaProducto {id:"OFE-002"}) MERGE (p)-[:TIENE_OFERTA]->(o);
MATCH (p:Producto {id:"PROD-001"}),(o:OfertaProducto {id:"OFE-003"}) MERGE (p)-[:TIENE_OFERTA]->(o);
MATCH (p:Producto {id:"PROD-002"}),(o:OfertaProducto {id:"OFE-004"}) MERGE (p)-[:TIENE_OFERTA]->(o);
MATCH (p:Producto {id:"PROD-003"}),(o:OfertaProducto {id:"OFE-005"}) MERGE (p)-[:TIENE_OFERTA]->(o);

// Ofertas -> tiendas
MATCH (o:OfertaProducto {id:"OFE-001"}),(t:TiendaExterior {id:"TIE-001"}) MERGE (o)-[:VENDIDA_POR]->(t);
MATCH (o:OfertaProducto {id:"OFE-002"}),(t:TiendaExterior {id:"TIE-002"}) MERGE (o)-[:VENDIDA_POR]->(t);
MATCH (o:OfertaProducto {id:"OFE-003"}),(t:TiendaExterior {id:"TIE-003"}) MERGE (o)-[:VENDIDA_POR]->(t);
MATCH (o:OfertaProducto {id:"OFE-004"}),(t:TiendaExterior {id:"TIE-002"}) MERGE (o)-[:VENDIDA_POR]->(t);
MATCH (o:OfertaProducto {id:"OFE-005"}),(t:TiendaExterior {id:"TIE-003"}) MERGE (o)-[:VENDIDA_POR]->(t);

// Tiendas -> paises
MATCH (t:TiendaExterior {id:"TIE-001"}),(p:PaisOrigen {codigo:"CN"}) MERGE (t)-[:UBICADA_EN]->(p);
MATCH (t:TiendaExterior {id:"TIE-002"}),(p:PaisOrigen {codigo:"US"}) MERGE (t)-[:UBICADA_EN]->(p);
MATCH (t:TiendaExterior {id:"TIE-003"}),(p:PaisOrigen {codigo:"ES"}) MERGE (t)-[:UBICADA_EN]->(p);

// Ofertas -> monedas
MATCH (o:OfertaProducto {id:"OFE-001"}),(m:Moneda {codigo:"USD"}) MERGE (o)-[:USA_MONEDA]->(m);
MATCH (o:OfertaProducto {id:"OFE-002"}),(m:Moneda {codigo:"USD"}) MERGE (o)-[:USA_MONEDA]->(m);
MATCH (o:OfertaProducto {id:"OFE-003"}),(m:Moneda {codigo:"EUR"}) MERGE (o)-[:USA_MONEDA]->(m);
MATCH (o:OfertaProducto {id:"OFE-004"}),(m:Moneda {codigo:"USD"}) MERGE (o)-[:USA_MONEDA]->(m);
MATCH (o:OfertaProducto {id:"OFE-005"}),(m:Moneda {codigo:"EUR"}) MERGE (o)-[:USA_MONEDA]->(m);

// Monedas -> cotizaciones
MATCH (m:Moneda {codigo:"USD"}),(c:Cotizacion {id:"COT-USD-001"}) MERGE (m)-[:TIENE_COTIZACION]->(c);
MATCH (m:Moneda {codigo:"EUR"}),(c:Cotizacion {id:"COT-EUR-001"}) MERGE (m)-[:TIENE_COTIZACION]->(c);
MATCH (m:Moneda {codigo:"CNY"}),(c:Cotizacion {id:"COT-CNY-001"}) MERGE (m)-[:TIENE_COTIZACION]->(c);

// Ofertas -> metodos de envio
MATCH (o:OfertaProducto {id:"OFE-001"}),(e:MetodoEnvio {id:"ENV-001"}) MERGE (o)-[:TIENE_ENVIO]->(e);
MATCH (o:OfertaProducto {id:"OFE-002"}),(e:MetodoEnvio {id:"ENV-002"}) MERGE (o)-[:TIENE_ENVIO]->(e);
MATCH (o:OfertaProducto {id:"OFE-003"}),(e:MetodoEnvio {id:"ENV-003"}) MERGE (o)-[:TIENE_ENVIO]->(e);
MATCH (o:OfertaProducto {id:"OFE-004"}),(e:MetodoEnvio {id:"ENV-004"}) MERGE (o)-[:TIENE_ENVIO]->(e);
MATCH (o:OfertaProducto {id:"OFE-005"}),(e:MetodoEnvio {id:"ENV-003"}) MERGE (o)-[:TIENE_ENVIO]->(e);

// Metodos de envio -> couriers
MATCH (e:MetodoEnvio {id:"ENV-001"}),(c:Courier {id:"COU-001"}) MERGE (e)-[:OPERADO_POR]->(c);
MATCH (e:MetodoEnvio {id:"ENV-002"}),(c:Courier {id:"COU-002"}) MERGE (e)-[:OPERADO_POR]->(c);
MATCH (e:MetodoEnvio {id:"ENV-003"}),(c:Courier {id:"COU-003"}) MERGE (e)-[:OPERADO_POR]->(c);
MATCH (e:MetodoEnvio {id:"ENV-004"}),(c:Courier {id:"COU-002"}) MERGE (e)-[:OPERADO_POR]->(c);
