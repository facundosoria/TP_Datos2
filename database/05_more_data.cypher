// ============================================================
// 05_more_data.cypher — Segunda expansión de datos
// Ejecutar DESPUÉS de 04_aranceles_pais.cypher (no borra nada)
//
// Agrega:
//   2 países nuevos (Brasil/Mercosur, Corea del Sur)
//   3 tiendas (Shopee BR, Mercado Livre BR, Samsung KR Direct)
//   1 moneda (KRW + cotización)
//   1 courier (Correios Brasil)
//   4 productos (Sony A6400, Galaxy Buds Pro, Remera Adidas, Mochila)
//   1 categoría nueva (Accesorios CAT-007)
//   9 ofertas nuevas (OFE-021 a OFE-029)
//   2 clientes nuevos (CLI-008, CLI-009)
//   4 compras/órdenes/paquetes con recorridos completos
//   2 incidencias en paquete coreano retenido
//   Tarifas Mercosur (BR ~0%) y Corea (KR similar a JP)
// ============================================================

// ============================================================
// MATCH — todos los nodos existentes que se necesitan
// ============================================================
MATCH (cn:PaisOrigen    {codigo: "CN"})
MATCH (us:PaisOrigen    {codigo: "US"})
MATCH (fr:PaisOrigen    {codigo: "FR"})
MATCH (jp:PaisOrigen    {codigo: "JP"})
MATCH (ali:TiendaExterior  {id: "TIE-001"})
MATCH (amazon:TiendaExterior {id: "TIE-002"})
MATCH (decathlon:TiendaExterior {id: "TIE-005"})
MATCH (rakuten:TiendaExterior  {id: "TIE-008"})
MATCH (usd:Moneda  {codigo: "USD"})
MATCH (eur:Moneda  {codigo: "EUR"})
MATCH (jpy:Moneda  {codigo: "JPY"})
MATCH (couCainiao:Courier {id: "COU-001"})
MATCH (couDHL:Courier     {id: "COU-002"})
MATCH (couFedEx:Courier   {id: "COU-004"})
MATCH (couUPS:Courier     {id: "COU-005"})
MATCH (couJP:Courier      {id: "COU-006"})
MATCH (depBA:Deposito     {id: "DEP-002"})
MATCH (depOsaka:Deposito  {id: "DEP-005"})
MATCH (depMiami:Deposito  {id: "DEP-003"})
MATCH (aduEzeiza:Aduana   {id: "ADU-001"})
MATCH (aduMiami:Aduana    {id: "ADU-002"})
MATCH (estTransito:EstadoEnvio  {id: "EST-001"})
MATCH (estRetenido:EstadoEnvio  {id: "EST-002"})
MATCH (estEntregado:EstadoEnvio {id: "EST-003"})
MATCH (cliAna:Cliente    {id: "CLI-003"})
MATCH (cliCarlos:Cliente {id: "CLI-004"})
MATCH (catElectro:CategoriaProducto {id: "CAT-001"})
MATCH (catRopa:CategoriaProducto    {id: "CAT-002"})
MATCH (tarElectro:TarifaArancelaria {id: "TAR-001"})
MATCH (tarRopa:TarifaArancelaria    {id: "TAR-002"})

WITH *

// ============================================================
// CREATE — nuevos países
// ============================================================
CREATE (brasil:PaisOrigen {codigo: "BR", nombre: "Brasil", region: "América del Sur"})
CREATE (korea:PaisOrigen  {codigo: "KR", nombre: "Corea del Sur", region: "Asia"})

// ============================================================
// CREATE — nuevas tiendas
// ============================================================
CREATE (shopee:TiendaExterior {
  id: "TIE-009", nombre: "Shopee Brasil",
  tipo: "Marketplace", sitioWeb: "shopee.com.br"
})
CREATE (meli:TiendaExterior {
  id: "TIE-010", nombre: "Mercado Libre Brasil",
  tipo: "Marketplace", sitioWeb: "mercadolibre.com.br"
})
CREATE (samsungKR:TiendaExterior {
  id: "TIE-011", nombre: "Samsung KR Direct",
  tipo: "Tienda oficial", sitioWeb: "samsung.com/kr"
})

// ============================================================
// CREATE — nueva moneda y cotización
// ============================================================
CREATE (krw:Moneda {codigo: "KRW", nombre: "Won coreano", simbolo: "₩"})
CREATE (cotKRW:Cotizacion {
  id: "COT-KRW-001", monedaOrigen: "KRW",
  monedaDestino: "ARS", valor: 0.72,
  fecha: date("2026-05-27")
})

// ============================================================
// CREATE — nuevo courier
// ============================================================
CREATE (couCorreios:Courier {
  id: "COU-007", nombre: "Correios Brasil",
  tipo: "Internacional", calificacion: 3.5
})

// ============================================================
// CREATE — nueva categoría y tarifa base
// ============================================================
CREATE (catAccesorios:CategoriaProducto {
  id: "CAT-007", nombre: "Accesorios"
})
CREATE (tarAccesorios:TarifaArancelaria {
  id: "TAR-007", porcentaje: 20.0,
  descripcion: "Arancel NCM para bolsos y accesorios de viaje (4202)"
})

// ============================================================
// CREATE — nuevos productos
// ============================================================
CREATE (sonyA6400:Producto {
  id: "PROD-010", nombre: "Cámara Sony Alpha A6400",
  marca: "Sony", modelo: "ILCE-6400"
})
CREATE (galaxyBuds:Producto {
  id: "PROD-011", nombre: "Auriculares Samsung Galaxy Buds Pro",
  marca: "Samsung", modelo: "SM-R190"
})
CREATE (remeraAdidas:Producto {
  id: "PROD-012", nombre: "Remera Adidas Tiro 23",
  marca: "Adidas", modelo: "Tiro 23 Club"
})
CREATE (mochilaS:Producto {
  id: "PROD-013", nombre: "Mochila Samsonite Openroad 15L",
  marca: "Samsonite", modelo: "Openroad 15L"
})

// ============================================================
// CREATE — nuevos clientes
// ============================================================
CREATE (valentina:Cliente {
  id: "CLI-008", nombre: "Valentina Torres",
  email: "valentina.torres@email.com", pais: "Argentina"
})
CREATE (matias:Cliente {
  id: "CLI-009", nombre: "Matías Herrera",
  email: "matias.herrera@email.com", pais: "Argentina"
})

// ============================================================
// CREATE — nuevos depósitos y aduana
// ============================================================
CREATE (depSeul:Deposito {
  id: "DEP-007", nombre: "Depósito Seúl",
  ciudad: "Seúl", pais: "Corea del Sur"
})
CREATE (depSaoPaulo:Deposito {
  id: "DEP-008", nombre: "Depósito São Paulo",
  ciudad: "São Paulo", pais: "Brasil"
})
CREATE (aduSeul:Aduana {
  id: "ADU-005", nombre: "Aduana Incheon",
  ciudad: "Seúl", pais: "Corea del Sur"
})

// ============================================================
// CREATE — nuevos métodos de envío (ENV-011 a ENV-019)
// ============================================================
// Sony A6400
CREATE (env011:MetodoEnvio {id: "ENV-011", costo: 4500.0,  diasEstimados: 14})
CREATE (env012:MetodoEnvio {id: "ENV-012", costo: 35.0,    diasEstimados: 8})
CREATE (env013:MetodoEnvio {id: "ENV-013", costo: 45000.0, diasEstimados: 12})
// Galaxy Buds Pro
CREATE (env014:MetodoEnvio {id: "ENV-014", costo: 38000.0, diasEstimados: 12})
CREATE (env015:MetodoEnvio {id: "ENV-015", costo: 12.0,    diasEstimados: 25})
// Remera Adidas
CREATE (env016:MetodoEnvio {id: "ENV-016", costo: 18.0, diasEstimados: 20})
CREATE (env017:MetodoEnvio {id: "ENV-017", costo: 22.0, diasEstimados: 7})
// Mochila Samsonite
CREATE (env018:MetodoEnvio {id: "ENV-018", costo: 25.0, diasEstimados: 18})
CREATE (env019:MetodoEnvio {id: "ENV-019", costo: 28.0, diasEstimados: 8})

// ============================================================
// CREATE — nuevas ofertas (OFE-021 a OFE-029)
// ============================================================
// Sony A6400
CREATE (ofe021:OfertaProducto {id: "OFE-021", precio: 142000.0})  // JPY
CREATE (ofe022:OfertaProducto {id: "OFE-022", precio: 950.0})     // USD
CREATE (ofe023:OfertaProducto {id: "OFE-023", precio: 1290000.0}) // KRW
// Galaxy Buds Pro
CREATE (ofe024:OfertaProducto {id: "OFE-024", precio: 310000.0})  // KRW
CREATE (ofe025:OfertaProducto {id: "OFE-025", precio: 185.0})     // USD
// Remera Adidas Tiro 23
CREATE (ofe026:OfertaProducto {id: "OFE-026", precio: 38.0})      // USD (Shopee BR)
CREATE (ofe027:OfertaProducto {id: "OFE-027", precio: 45.0})      // USD (Amazon)
// Mochila Samsonite
CREATE (ofe028:OfertaProducto {id: "OFE-028", precio: 110.0})     // USD (Mercado Libre BR)
CREATE (ofe029:OfertaProducto {id: "OFE-029", precio: 125.0})     // USD (Amazon)

// ============================================================
// CREATE — compras, órdenes, paquetes
// ============================================================
// Valentina — Sony A6400 desde Rakuten JP — En tránsito
CREATE (com009:Compra {id: "COM-009", fecha: date("2026-05-10"), total: 1095965.0, moneda: "ARS"})
CREATE (ord009:Orden  {id: "ORD-009", fecha: date("2026-05-10"), estado: "confirmada"})
CREATE (paq9009:Paquete {
  codigo: "PKG-9009", peso: 0.8, dimensiones: "25x17x8cm",
  fechaCreacion: date("2026-05-11")
})

// Matías — Galaxy Buds Pro desde Samsung KR — Retenido en aduana
CREATE (com010:Compra {id: "COM-010", fecha: date("2026-05-14"), total: 249984.0, moneda: "ARS"})
CREATE (ord010:Orden  {id: "ORD-010", fecha: date("2026-05-14"), estado: "confirmada"})
CREATE (paq9010:Paquete {
  codigo: "PKG-9010", peso: 0.2, dimensiones: "15x10x5cm",
  fechaCreacion: date("2026-05-15")
})

// Ana (CLI-003) recompra — Remera Adidas desde Shopee Brasil — Entregado
CREATE (com011:Compra {id: "COM-011", fecha: date("2026-05-02"), total: 44820.0, moneda: "ARS"})
CREATE (ord011:Orden  {id: "ORD-011", fecha: date("2026-05-02"), estado: "completada"})
CREATE (paq9011:Paquete {
  codigo: "PKG-9011", peso: 0.3, dimensiones: "30x20x2cm",
  fechaCreacion: date("2026-05-03")
})

// Carlos (CLI-004) — Mochila Samsonite desde Mercado Libre BR — En tránsito
CREATE (com012:Compra {id: "COM-012", fecha: date("2026-05-20"), total: 107100.0, moneda: "ARS"})
CREATE (ord012:Orden  {id: "ORD-012", fecha: date("2026-05-20"), estado: "confirmada"})
CREATE (paq9012:Paquete {
  codigo: "PKG-9012", peso: 0.9, dimensiones: "35x25x15cm",
  fechaCreacion: date("2026-05-21")
})

// ============================================================
// CREATE — incidencias del paquete coreano retenido
// ============================================================
CREATE (inc009:Incidencia {
  id: "INC-009", tipo: "Documentación",
  descripcion: "Certificado de origen de Corea del Sur faltante",
  gravedad: "Media", fechaRegistro: date("2026-05-20")
})
CREATE (inc010:Incidencia {
  id: "INC-010", tipo: "Valoración aduanera",
  descripcion: "Valor declarado (USD 222) no coincide con factura del vendedor (USD 310)",
  gravedad: "Alta", fechaRegistro: date("2026-05-21")
})

// ============================================================
// CREATE — declaración jurada, pagos y direcciones
// ============================================================
CREATE (dj005:DeclaracionJurada {
  id: "DJ-005", tipo: "Declaración de valor",
  fecha: date("2026-05-22"), estado: "Observada"
})
CREATE (pag009:Pago {id: "PAG-009", monto: 950.0,  moneda: "USD", fecha: date("2026-05-10"), metodo: "Tarjeta"})
CREATE (pag010:Pago {id: "PAG-010", monto: 222.0,  moneda: "USD", fecha: date("2026-05-14"), metodo: "PayPal"})
CREATE (pag011:Pago {id: "PAG-011", monto: 38.0,   moneda: "USD", fecha: date("2026-05-02"), metodo: "Transferencia"})
CREATE (pag012:Pago {id: "PAG-012", monto: 110.0,  moneda: "USD", fecha: date("2026-05-20"), metodo: "Tarjeta"})

CREATE (dir008:DireccionEntrega {
  id: "DIR-008", calle: "Av. Rivadavia 3200", ciudad: "Buenos Aires",
  provincia: "Buenos Aires", codigoPostal: "1204", pais: "Argentina"
})
CREATE (dir009:DireccionEntrega {
  id: "DIR-009", calle: "San Martín 580", ciudad: "Mendoza",
  provincia: "Mendoza", codigoPostal: "5500", pais: "Argentina"
})

// ============================================================
// CREATE — TarifaArancelariaPais para Brasil y Corea del Sur
// ============================================================
// Brasil (BR) — TEC interna Mercosur: casi 0%
CREATE (tapBrElec:TarifaArancelariaPais {
  id: "TAP-030", categoriaId: "CAT-001", porcentaje: 2.0,
  descripcion: "Electrónica Brasil — TEC interna Mercosur mínima"
})
CREATE (tapBrRopa:TarifaArancelariaPais {
  id: "TAP-031", categoriaId: "CAT-002", porcentaje: 0.0,
  descripcion: "Indumentaria Brasil — arancel 0% Mercosur interno"
})
CREATE (tapBrCalz:TarifaArancelariaPais {
  id: "TAP-032", categoriaId: "CAT-003", porcentaje: 0.0,
  descripcion: "Calzado Brasil — arancel 0% Mercosur interno"
})
CREATE (tapBrJug:TarifaArancelariaPais {
  id: "TAP-033", categoriaId: "CAT-004", porcentaje: 0.0,
  descripcion: "Juguetes Brasil — arancel 0% Mercosur interno"
})
CREATE (tapBrHerr:TarifaArancelariaPais {
  id: "TAP-034", categoriaId: "CAT-006", porcentaje: 2.0,
  descripcion: "Herramientas Brasil — TEC interna Mercosur mínima"
})
CREATE (tapBrAcc:TarifaArancelariaPais {
  id: "TAP-035", categoriaId: "CAT-007", porcentaje: 0.0,
  descripcion: "Accesorios Brasil — arancel 0% Mercosur interno"
})
// Corea del Sur (KR) — Asia sin acuerdo preferencial
CREATE (tapKrElec:TarifaArancelariaPais {
  id: "TAP-036", categoriaId: "CAT-001", porcentaje: 18.0,
  descripcion: "Electrónica Corea del Sur — Asia sin acuerdo preferencial"
})
CREATE (tapKrAcc:TarifaArancelariaPais {
  id: "TAP-037", categoriaId: "CAT-007", porcentaje: 20.0,
  descripcion: "Accesorios Corea del Sur — Asia sin acuerdo preferencial"
})

// ============================================================
// RELACIONES — países ↔ tiendas
// ============================================================
CREATE (shopee)-[:UBICADA_EN]->(brasil)
CREATE (meli)-[:UBICADA_EN]->(brasil)
CREATE (samsungKR)-[:UBICADA_EN]->(korea)

// ============================================================
// RELACIONES — moneda ↔ cotización
// ============================================================
CREATE (krw)-[:TIENE_COTIZACION]->(cotKRW)

// ============================================================
// RELACIONES — categoría + tarifa base
// ============================================================
CREATE (catAccesorios)-[:APLICA_ARANCEL]->(tarAccesorios)

// ============================================================
// RELACIONES — productos ↔ categorías
// ============================================================
CREATE (sonyA6400)-[:PERTENECE_A]->(catElectro)
CREATE (galaxyBuds)-[:PERTENECE_A]->(catElectro)
CREATE (remeraAdidas)-[:PERTENECE_A]->(catRopa)
CREATE (mochilaS)-[:PERTENECE_A]->(catAccesorios)

// ============================================================
// RELACIONES — ofertas ↔ productos
// ============================================================
CREATE (sonyA6400)-[:TIENE_OFERTA]->(ofe021)
CREATE (sonyA6400)-[:TIENE_OFERTA]->(ofe022)
CREATE (sonyA6400)-[:TIENE_OFERTA]->(ofe023)
CREATE (galaxyBuds)-[:TIENE_OFERTA]->(ofe024)
CREATE (galaxyBuds)-[:TIENE_OFERTA]->(ofe025)
CREATE (remeraAdidas)-[:TIENE_OFERTA]->(ofe026)
CREATE (remeraAdidas)-[:TIENE_OFERTA]->(ofe027)
CREATE (mochilaS)-[:TIENE_OFERTA]->(ofe028)
CREATE (mochilaS)-[:TIENE_OFERTA]->(ofe029)

// ============================================================
// RELACIONES — ofertas ↔ tiendas
// ============================================================
CREATE (ofe021)-[:VENDIDA_POR]->(rakuten)
CREATE (ofe022)-[:VENDIDA_POR]->(amazon)
CREATE (ofe023)-[:VENDIDA_POR]->(samsungKR)
CREATE (ofe024)-[:VENDIDA_POR]->(samsungKR)
CREATE (ofe025)-[:VENDIDA_POR]->(ali)
CREATE (ofe026)-[:VENDIDA_POR]->(shopee)
CREATE (ofe027)-[:VENDIDA_POR]->(amazon)
CREATE (ofe028)-[:VENDIDA_POR]->(meli)
CREATE (ofe029)-[:VENDIDA_POR]->(amazon)

// ============================================================
// RELACIONES — ofertas ↔ monedas
// ============================================================
CREATE (ofe021)-[:USA_MONEDA]->(jpy)
CREATE (ofe022)-[:USA_MONEDA]->(usd)
CREATE (ofe023)-[:USA_MONEDA]->(krw)
CREATE (ofe024)-[:USA_MONEDA]->(krw)
CREATE (ofe025)-[:USA_MONEDA]->(usd)
CREATE (ofe026)-[:USA_MONEDA]->(usd)
CREATE (ofe027)-[:USA_MONEDA]->(usd)
CREATE (ofe028)-[:USA_MONEDA]->(usd)
CREATE (ofe029)-[:USA_MONEDA]->(usd)

// ============================================================
// RELACIONES — ofertas ↔ métodos de envío ↔ couriers
// ============================================================
CREATE (ofe021)-[:TIENE_ENVIO]->(env011)
CREATE (env011)-[:OPERADO_POR]->(couJP)

CREATE (ofe022)-[:TIENE_ENVIO]->(env012)
CREATE (env012)-[:OPERADO_POR]->(couFedEx)

CREATE (ofe023)-[:TIENE_ENVIO]->(env013)
CREATE (env013)-[:OPERADO_POR]->(couUPS)

CREATE (ofe024)-[:TIENE_ENVIO]->(env014)
CREATE (env014)-[:OPERADO_POR]->(couUPS)

CREATE (ofe025)-[:TIENE_ENVIO]->(env015)
CREATE (env015)-[:OPERADO_POR]->(couCainiao)

CREATE (ofe026)-[:TIENE_ENVIO]->(env016)
CREATE (env016)-[:OPERADO_POR]->(couCorreios)

CREATE (ofe027)-[:TIENE_ENVIO]->(env017)
CREATE (env017)-[:OPERADO_POR]->(couFedEx)

CREATE (ofe028)-[:TIENE_ENVIO]->(env018)
CREATE (env018)-[:OPERADO_POR]->(couCorreios)

CREATE (ofe029)-[:TIENE_ENVIO]->(env019)
CREATE (env019)-[:OPERADO_POR]->(couFedEx)

// ============================================================
// RELACIONES — clientes ↔ compras
// ============================================================
CREATE (valentina)-[:REALIZA]->(com009)
CREATE (matias)-[:REALIZA]->(com010)
CREATE (cliAna)-[:REALIZA]->(com011)
CREATE (cliCarlos)-[:REALIZA]->(com012)

// ============================================================
// RELACIONES — compras ↔ órdenes
// ============================================================
CREATE (com009)-[:CONTIENE]->(ord009)
CREATE (com010)-[:CONTIENE]->(ord010)
CREATE (com011)-[:CONTIENE]->(ord011)
CREATE (com012)-[:CONTIENE]->(ord012)

// ============================================================
// RELACIONES — órdenes ↔ productos
// ============================================================
CREATE (ord009)-[:INCLUYE]->(sonyA6400)
CREATE (ord010)-[:INCLUYE]->(galaxyBuds)
CREATE (ord011)-[:INCLUYE]->(remeraAdidas)
CREATE (ord012)-[:INCLUYE]->(mochilaS)

// ============================================================
// RELACIONES — compras/órdenes ↔ paquetes
// ============================================================
CREATE (com009)-[:GENERA]->(paq9009)
CREATE (ord009)-[:GENERA_PAQUETE]->(paq9009)
CREATE (com010)-[:GENERA]->(paq9010)
CREATE (ord010)-[:GENERA_PAQUETE]->(paq9010)
CREATE (com011)-[:GENERA]->(paq9011)
CREATE (ord011)-[:GENERA_PAQUETE]->(paq9011)
CREATE (com012)-[:GENERA]->(paq9012)
CREATE (ord012)-[:GENERA_PAQUETE]->(paq9012)

// ============================================================
// RELACIONES — paquetes ↔ estados y couriers
// ============================================================
CREATE (paq9009)-[:TIENE_ESTADO]->(estTransito)
CREATE (paq9009)-[:TRANSPORTADO_POR]->(couJP)

CREATE (paq9010)-[:TIENE_ESTADO]->(estRetenido)
CREATE (paq9010)-[:TRANSPORTADO_POR]->(couUPS)

CREATE (paq9011)-[:TIENE_ESTADO]->(estEntregado)
CREATE (paq9011)-[:TRANSPORTADO_POR]->(couCorreios)

CREATE (paq9012)-[:TIENE_ESTADO]->(estTransito)
CREATE (paq9012)-[:TRANSPORTADO_POR]->(couCorreios)

// ============================================================
// RELACIONES — recorridos PASA_POR
// ============================================================
// PKG-9009: Valentina — Sony desde Japón — En tránsito
CREATE (paq9009)-[:PASA_POR {orden: 1, fecha: date("2026-05-12")}]->(depOsaka)
CREATE (paq9009)-[:PASA_POR {orden: 2, fecha: date("2026-05-20")}]->(aduEzeiza)

// PKG-9010: Matías — Galaxy Buds desde Corea — Retenido en Aduana Incheon→Ezeiza
CREATE (paq9010)-[:PASA_POR {orden: 1, fecha: date("2026-05-16")}]->(depSeul)
CREATE (paq9010)-[:PASA_POR {orden: 2, fecha: date("2026-05-17")}]->(aduSeul)
CREATE (paq9010)-[:PASA_POR {orden: 3, fecha: date("2026-05-22")}]->(aduEzeiza)

// PKG-9011: Ana — Remera desde Brasil — Entregado
CREATE (paq9011)-[:PASA_POR {orden: 1, fecha: date("2026-05-04")}]->(depSaoPaulo)
CREATE (paq9011)-[:PASA_POR {orden: 2, fecha: date("2026-05-10")}]->(aduEzeiza)
CREATE (paq9011)-[:PASA_POR {orden: 3, fecha: date("2026-05-13")}]->(depBA)

// PKG-9012: Carlos — Mochila desde Brasil — En tránsito
CREATE (paq9012)-[:PASA_POR {orden: 1, fecha: date("2026-05-22")}]->(depSaoPaulo)
CREATE (paq9012)-[:PASA_POR {orden: 2, fecha: date("2026-05-26")}]->(aduEzeiza)

// ============================================================
// RELACIONES — paquete entregado ↔ dirección
// ============================================================
CREATE (paq9011)-[:ENTREGADO_EN]->(dir008)

// ============================================================
// RELACIONES — incidencias en paquete retenido
// ============================================================
CREATE (paq9010)-[:TIENE_INCIDENCIA]->(inc009)
CREATE (paq9010)-[:TIENE_INCIDENCIA]->(inc010)

// ============================================================
// RELACIONES — declaración jurada del retenido
// ============================================================
CREATE (dj005)-[:CORRESPONDE_A]->(paq9010)

// ============================================================
// RELACIONES — pagos ↔ compras
// ============================================================
CREATE (com009)-[:PAGA_CON]->(pag009)
CREATE (com010)-[:PAGA_CON]->(pag010)
CREATE (com011)-[:PAGA_CON]->(pag011)
CREATE (com012)-[:PAGA_CON]->(pag012)

// ============================================================
// RELACIONES — TarifaArancelariaPais ↔ países
// ============================================================
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrElec)
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrRopa)
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrCalz)
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrJug)
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrHerr)
CREATE (brasil)-[:TIENE_TARIFA_PAIS]->(tapBrAcc)
CREATE (korea)-[:TIENE_TARIFA_PAIS]->(tapKrElec)
CREATE (korea)-[:TIENE_TARIFA_PAIS]->(tapKrAcc)

// ============================================================
// RELACIONES — nuevas direcciones de entrega para clientes
// ============================================================
CREATE (valentina)-[:TIENE_DIRECCION]->(dir008)
CREATE (matias)-[:TIENE_DIRECCION]->(dir009)

// ============================================================
// FIX — Crear relación directa Compra-[:GENERA]->Paquete
// para compras anteriores que solo tenían el path via Orden
// ============================================================
WITH 1 AS dummy
MATCH (com:Compra)-[:GENERA]->(ord:Orden)-[:GENERA_PAQUETE]->(paq:Paquete)
WHERE NOT (com)-[:GENERA]->(paq)
CREATE (com)-[:GENERA]->(paq)
RETURN count(*) AS relacionesCreadas;
