// ============================================================
// 03_more_data.cypher — Expansión masiva de datos
// Ejecutar DESPUÉS de 02_seed_data.cypher (no borra nada)
// Estructura: todos los MATCH primero → WITH * → CREATE
// ============================================================

MATCH (facundo:Cliente {id: "CLI-001"})
MATCH (electronica:CategoriaProducto {id: "CAT-001"})
MATCH (amazon:TiendaExterior {id: "TIE-002"})
MATCH (aliexpress:TiendaExterior {id: "TIE-001"})
MATCH (usd:Moneda {codigo: "USD"})
MATCH (eur:Moneda {codigo: "EUR"})
MATCH (cotUsd:Cotizacion {id: "COT-USD-001"})
MATCH (cotEur:Cotizacion {id: "COT-EUR-001"})
MATCH (cainiao:Courier {id: "COU-001"})
MATCH (dhl:Courier {id: "COU-002"})
MATCH (correos:Courier {id: "COU-003"})
MATCH (uk:PaisOrigen {codigo: "UK"})
MATCH (usa:PaisOrigen {codigo: "US"})
MATCH (depBA:Deposito {id: "DEP-002"})
MATCH (depUSA:Deposito {id: "DEP-003"})
MATCH (depChina:Deposito {id: "DEP-001"})
MATCH (aduanaEzeiza:Aduana {id: "ADU-001"})
MATCH (aduanaMiami:Aduana {id: "ADU-002"})
MATCH (estadoTransito:EstadoEnvio {id: "EST-001"})
MATCH (estadoRetenido:EstadoEnvio {id: "EST-002"})
MATCH (estadoEntregado:EstadoEnvio {id: "EST-003"})
MATCH (iva:Impuesto {id: "IMP-001"})

WITH *

// ---------- CLIENTES ----------
CREATE (ana:Cliente    { id: "CLI-003", nombre: "Ana García",       email: "ana@mail.com",    telefono: "3512222222" })
CREATE (carlos:Cliente { id: "CLI-004", nombre: "Carlos López",     email: "carlos@mail.com", telefono: "3513333333" })
CREATE (maria:Cliente  { id: "CLI-005", nombre: "María Rodríguez",  email: "maria@mail.com",  telefono: "3514444444" })
CREATE (pedro:Cliente  { id: "CLI-006", nombre: "Pedro Martínez",   email: "pedro@mail.com",  telefono: "3515555555" })
CREATE (laura:Cliente  { id: "CLI-007", nombre: "Laura Fernández",  email: "laura@mail.com",  telefono: "3516666666" })

// ---------- CATEGORÍAS Y ARANCELES ----------
CREATE (calzado:CategoriaProducto      { id: "CAT-003", nombre: "Calzado",      descripcion: "Calzado deportivo y casual importado" })
CREATE (juguetes:CategoriaProducto     { id: "CAT-004", nombre: "Juguetes",     descripcion: "Juguetes y sets de construcción importados" })
CREATE (libros:CategoriaProducto       { id: "CAT-005", nombre: "Libros",       descripcion: "Libros técnicos y literatura importada" })
CREATE (herramientas:CategoriaProducto { id: "CAT-006", nombre: "Herramientas", descripcion: "Herramientas eléctricas y manuales importadas" })

CREATE (tarCalzado:TarifaArancelaria      { id: "TAR-003", porcentaje: 35.0, descripcion: "Arancel para calzado importado" })
CREATE (tarJuguetes:TarifaArancelaria     { id: "TAR-004", porcentaje: 70.0, descripcion: "Arancel para juguetes importados" })
CREATE (tarLibros:TarifaArancelaria       { id: "TAR-005", porcentaje: 0.0,  descripcion: "Libros exentos de arancel" })
CREATE (tarHerramientas:TarifaArancelaria { id: "TAR-006", porcentaje: 45.0, descripcion: "Arancel para herramientas importadas" })

// ---------- PRODUCTOS ----------
CREATE (zapatillas:Producto  { id: "PROD-004", nombre: "Zapatillas Adidas Ultraboost 22", marca: "Adidas",       modelo: "Ultraboost 22", descripcion: "Zapatillas running con tecnología Boost" })
CREATE (lego:Producto        { id: "PROD-005", nombre: "LEGO Technic Bugatti Chiron",     marca: "LEGO",         modelo: "42083",         descripcion: "Set de construcción avanzado 3599 piezas" })
CREATE (libroClean:Producto  { id: "PROD-006", nombre: "Libro Clean Code",               marca: "Prentice Hall", modelo: "1ra edición",   descripcion: "Clean Code: A Handbook of Agile Software Craftsmanship" })
CREATE (taladro:Producto     { id: "PROD-007", nombre: "Taladro Percutor DeWalt 18V",    marca: "DeWalt",        modelo: "DCD778",        descripcion: "Taladro percutor inalámbrico 18V con maletín" })
CREATE (teclado:Producto     { id: "PROD-008", nombre: "Teclado Mecánico Keychron K2",   marca: "Keychron",      modelo: "K2 v2",         descripcion: "Teclado mecánico inalámbrico TKL con switches Gateron" })
CREATE (monitor:Producto     { id: "PROD-009", nombre: "Monitor Samsung 24 Curvo",       marca: "Samsung",       modelo: "CF396",         descripcion: "Monitor Full HD 24 pulgadas curvo 60Hz" })

// ---------- PAÍSES ----------
CREATE (alemania:PaisOrigen { codigo: "DE", nombre: "Alemania", region: "Europa" })
CREATE (francia:PaisOrigen  { codigo: "FR", nombre: "Francia",  region: "Europa" })
CREATE (japon:PaisOrigen    { codigo: "JP", nombre: "Japón",    region: "Asia" })

// ---------- TIENDAS ----------
CREATE (walmart:TiendaExterior    { id: "TIE-004", nombre: "Walmart US",         tipo: "Marketplace",         reputacion: 4.3 })
CREATE (decathlon:TiendaExterior  { id: "TIE-005", nombre: "Decathlon France",   tipo: "Tienda especializada", reputacion: 4.6 })
CREATE (bookdep:TiendaExterior    { id: "TIE-006", nombre: "Book Depository",    tipo: "Tienda especializada", reputacion: 4.4 })
CREATE (mediamarkt:TiendaExterior { id: "TIE-007", nombre: "MediaMarkt",         tipo: "Marketplace",         reputacion: 4.1 })
CREATE (rakuten:TiendaExterior    { id: "TIE-008", nombre: "Rakuten Japan",       tipo: "Marketplace",         reputacion: 4.0 })

// ---------- MONEDAS Y COTIZACIONES ----------
CREATE (gbp:Moneda { codigo: "GBP", nombre: "Libra esterlina", simbolo: "£" })
CREATE (jpy:Moneda { codigo: "JPY", nombre: "Yen japonés",     simbolo: "¥" })
CREATE (cotGbp:Cotizacion { id: "COT-GBP-001", monedaDestino: "ARS", valor: 1250.0, fecha: date("2026-05-23") })
CREATE (cotJpy:Cotizacion { id: "COT-JPY-001", monedaDestino: "ARS", valor: 6.5,    fecha: date("2026-05-23") })

// ---------- COURIERS ----------
CREATE (fedex:Courier    { id: "COU-004", nombre: "FedEx",      tipo: "Internacional", calificacion: 4.5 })
CREATE (ups:Courier      { id: "COU-005", nombre: "UPS",        tipo: "Internacional", calificacion: 4.3 })
CREATE (japanpost:Courier { id: "COU-006", nombre: "Japan Post", tipo: "Internacional", calificacion: 4.6 })

// ---------- MÉTODOS DE ENVÍO ----------
CREATE (envDecathlon:MetodoEnvio  { id: "ENV-005", nombre: "Colissimo International", costo: 22.0, diasEstimados: 14, tipo: "Estándar" })
CREATE (envWalmart:MetodoEnvio    { id: "ENV-006", nombre: "FedEx International",     costo: 35.0, diasEstimados: 8,  tipo: "Express" })
CREATE (envBookDep:MetodoEnvio    { id: "ENV-007", nombre: "Royal Mail International", costo: 8.0,  diasEstimados: 20, tipo: "Económico" })
CREATE (envMediaMarkt:MetodoEnvio { id: "ENV-008", nombre: "DHL Express Europe",      costo: 28.0, diasEstimados: 6,  tipo: "Express" })
CREATE (envRakuten:MetodoEnvio    { id: "ENV-009", nombre: "Japan Post EMS",           costo: 30.0, diasEstimados: 12, tipo: "Prioritario" })
CREATE (envAliExtra:MetodoEnvio   { id: "ENV-010", nombre: "AliExpress Premium",       costo: 18.0, diasEstimados: 15, tipo: "Prioritario" })

// ---------- OFERTAS ZAPATILLAS ----------
CREATE (ofeZapDecathlon:OfertaProducto  { id: "OFE-006", precio: 110.0, condicion: "Nuevo", stockDisponible: true,  urlReferencia: "https://decathlon.fr/adidas-ultraboost" })
CREATE (ofeZapWalmart:OfertaProducto    { id: "OFE-007", precio: 125.0, condicion: "Nuevo", stockDisponible: true,  urlReferencia: "https://walmart.com/adidas-ultraboost" })
CREATE (ofeZapMediamarkt:OfertaProducto { id: "OFE-008", precio: 118.0, condicion: "Nuevo", stockDisponible: false, urlReferencia: "https://mediamarkt.de/adidas-ultraboost" })

// ---------- OFERTAS LEGO ----------
CREATE (ofeLegoAmazon:OfertaProducto    { id: "OFE-009", precio: 320.0,   condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://amazon.com/lego-bugatti" })
CREATE (ofeLegoRakuten:OfertaProducto   { id: "OFE-010", precio: 29800.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://rakuten.co.jp/lego-bugatti" })
CREATE (ofeLegoMediamarkt:OfertaProducto { id: "OFE-011", precio: 295.0,  condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://mediamarkt.de/lego-bugatti" })

// ---------- OFERTAS LIBRO ----------
CREATE (ofeLibroBookdep:OfertaProducto { id: "OFE-012", precio: 38.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://bookdepository.com/clean-code" })
CREATE (ofeLibroAmazon:OfertaProducto  { id: "OFE-013", precio: 42.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://amazon.com/clean-code" })

// ---------- OFERTAS TALADRO ----------
CREATE (ofeTaladroWalmart:OfertaProducto   { id: "OFE-014", precio: 189.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://walmart.com/dewalt-dcd778" })
CREATE (ofeTaladroMediamarkt:OfertaProducto { id: "OFE-015", precio: 175.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://mediamarkt.de/dewalt-dcd778" })

// ---------- OFERTAS TECLADO ----------
CREATE (ofeTecladoAli:OfertaProducto    { id: "OFE-016", precio: 72.0,   condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://aliexpress.com/keychron-k2" })
CREATE (ofeTecladoAmazon:OfertaProducto { id: "OFE-017", precio: 95.0,   condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://amazon.com/keychron-k2" })
CREATE (ofeTecladoRakuten:OfertaProducto { id: "OFE-018", precio: 8900.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://rakuten.co.jp/keychron-k2" })

// ---------- OFERTAS MONITOR ----------
CREATE (ofeMonitorAmazon:OfertaProducto    { id: "OFE-019", precio: 210.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://amazon.com/samsung-cf396" })
CREATE (ofeMonitorMediamarkt:OfertaProducto { id: "OFE-020", precio: 195.0, condicion: "Nuevo", stockDisponible: true, urlReferencia: "https://mediamarkt.de/samsung-cf396" })

// ---------- DEPÓSITOS Y ADUANAS ----------
CREATE (depositoFrankfurt:Deposito { id: "DEP-004", nombre: "Depósito Frankfurt", ciudad: "Frankfurt", pais: "Alemania" })
CREATE (depositoOsaka:Deposito     { id: "DEP-005", nombre: "Depósito Osaka",     ciudad: "Osaka",     pais: "Japón" })
CREATE (depositoParis:Deposito     { id: "DEP-006", nombre: "Depósito París",      ciudad: "París",     pais: "Francia" })
CREATE (aduanaFrankfurt:Aduana     { id: "ADU-003", nombre: "Aduana Frankfurt",   ciudad: "Frankfurt", pais: "Alemania" })
CREATE (aduanaOsaka:Aduana         { id: "ADU-004", nombre: "Aduana Osaka",       ciudad: "Osaka",     pais: "Japón" })

// ---------- INCIDENCIAS ----------
CREATE (incArancel:Incidencia  { id: "INC-003", tipo: "Pago de arancel pendiente",    descripcion: "El paquete requiere pago de arancel del 70% antes de ser liberado", gravedad: "Alta" })
CREATE (incPeso:Incidencia     { id: "INC-004", tipo: "Peso declarado incorrecto",    descripcion: "El peso declarado no coincide con el peso real del paquete",         gravedad: "Media" })
CREATE (incDireccion:Incidencia { id: "INC-005", tipo: "Dirección incompleta",        descripcion: "La dirección de entrega no tiene número de departamento",           gravedad: "Baja" })
CREATE (incEtiqueta:Incidencia  { id: "INC-006", tipo: "Etiqueta dañada",             descripcion: "La etiqueta de tracking fue dañada durante el transporte",           gravedad: "Baja" })
CREATE (incHuelga:Incidencia    { id: "INC-007", tipo: "Demora por huelga portuaria", descripcion: "Puerto de origen con huelga sindical, demora estimada 10 días",      gravedad: "Alta" })
CREATE (incFactura:Incidencia   { id: "INC-008", tipo: "Factura comercial faltante",  descripcion: "Aduana solicita factura original del vendedor para liberar el paquete", gravedad: "Alta" })

// ---------- IMPUESTO PAÍS ----------
CREATE (impPais:Impuesto { id: "IMP-002", nombre: "Impuesto PAIS", porcentaje: 8.0, descripcion: "Impuesto para el sostenimiento de las reservas del BCRA" })

// ---------- COMPRAS Y ÓRDENES ----------
CREATE (compra3:Compra { id: "COM-003", fecha: date("2026-05-10"), estado: "Entregada" })
CREATE (compra4:Compra { id: "COM-004", fecha: date("2026-05-12"), estado: "Retenida" })
CREATE (compra5:Compra { id: "COM-005", fecha: date("2026-05-15"), estado: "En camino" })
CREATE (compra6:Compra { id: "COM-006", fecha: date("2026-05-16"), estado: "Retenida" })
CREATE (compra7:Compra { id: "COM-007", fecha: date("2026-05-18"), estado: "Entregada" })
CREATE (compra8:Compra { id: "COM-008", fecha: date("2026-05-20"), estado: "En camino" })

CREATE (orden3:Orden { id: "ORD-003", numeroOrden: "DEC-2026-0003", fecha: date("2026-05-10") })
CREATE (orden4:Orden { id: "ORD-004", numeroOrden: "RAK-2026-0004", fecha: date("2026-05-12") })
CREATE (orden5:Orden { id: "ORD-005", numeroOrden: "ALI-2026-0005", fecha: date("2026-05-15") })
CREATE (orden6:Orden { id: "ORD-006", numeroOrden: "MDM-2026-0006", fecha: date("2026-05-16") })
CREATE (orden7:Orden { id: "ORD-007", numeroOrden: "WAL-2026-0007", fecha: date("2026-05-18") })
CREATE (orden8:Orden { id: "ORD-008", numeroOrden: "BKD-2026-0008", fecha: date("2026-05-20") })

// ---------- PAQUETES ----------
CREATE (paq3:Paquete { codigo: "PKG-9003", pesoKg: 1.2, fechaCreacion: date("2026-05-10"), trackingCode: "TRK-FR-9003" })
CREATE (paq4:Paquete { codigo: "PKG-9004", pesoKg: 4.5, fechaCreacion: date("2026-05-12"), trackingCode: "TRK-JP-9004" })
CREATE (paq5:Paquete { codigo: "PKG-9005", pesoKg: 0.9, fechaCreacion: date("2026-05-15"), trackingCode: "TRK-CN-9005" })
CREATE (paq6:Paquete { codigo: "PKG-9006", pesoKg: 6.0, fechaCreacion: date("2026-05-16"), trackingCode: "TRK-DE-9006" })
CREATE (paq7:Paquete { codigo: "PKG-9007", pesoKg: 3.2, fechaCreacion: date("2026-05-18"), trackingCode: "TRK-US-9007" })
CREATE (paq8:Paquete { codigo: "PKG-9008", pesoKg: 0.4, fechaCreacion: date("2026-05-20"), trackingCode: "TRK-UK-9008" })

// ---------- DECLARACIONES JURADAS ----------
CREATE (dj2:DeclaracionJurada { id: "DJ-002", fechaPresentacion: date("2026-05-13"), estado: "Aprobada" })
CREATE (dj3:DeclaracionJurada { id: "DJ-003", fechaPresentacion: date("2026-05-17"), estado: "Pendiente" })
CREATE (dj4:DeclaracionJurada { id: "DJ-004", fechaPresentacion: date("2026-05-20"), estado: "Pendiente" })

// ---------- PAGOS ----------
CREATE (pago3:Pago { id: "PAG-003", monto: 215600.0, fecha: date("2026-05-10"), medioPago: "Tarjeta" })
CREATE (pago4:Pago { id: "PAG-004", monto: 926520.0, fecha: date("2026-05-12"), medioPago: "Transferencia" })
CREATE (pago5:Pago { id: "PAG-005", monto: 135000.0, fecha: date("2026-05-15"), medioPago: "Tarjeta" })
CREATE (pago6:Pago { id: "PAG-006", monto: 479325.0, fecha: date("2026-05-16"), medioPago: "Débito" })
CREATE (pago7:Pago { id: "PAG-007", monto: 371925.0, fecha: date("2026-05-18"), medioPago: "Tarjeta" })
CREATE (pago8:Pago { id: "PAG-008", monto: 57750.0,  fecha: date("2026-05-20"), medioPago: "Transferencia" })

// ---------- DIRECCIONES ----------
CREATE (dir3:DireccionEntrega { id: "DIR-003", calle: "Bv. Chacabuco",  numero: "580",  ciudad: "Córdoba",       provincia: "Córdoba",      pais: "Argentina", codigoPostal: "5000" })
CREATE (dir4:DireccionEntrega { id: "DIR-004", calle: "Rivadavia",      numero: "2100", ciudad: "Buenos Aires",  provincia: "Buenos Aires", pais: "Argentina", codigoPostal: "1034" })
CREATE (dir5:DireccionEntrega { id: "DIR-005", calle: "Colón",          numero: "890",  ciudad: "Mendoza",       provincia: "Mendoza",      pais: "Argentina", codigoPostal: "5500" })
CREATE (dir6:DireccionEntrega { id: "DIR-006", calle: "San Luis",       numero: "430",  ciudad: "Mar del Plata", provincia: "Buenos Aires", pais: "Argentina", codigoPostal: "7600" })
CREATE (dir7:DireccionEntrega { id: "DIR-007", calle: "Independencia",  numero: "1560", ciudad: "Tucumán",       provincia: "Tucumán",      pais: "Argentina", codigoPostal: "4000" })

// =============================================================
// RELACIONES — categorías y aranceles
// =============================================================
CREATE (calzado)-[:APLICA_ARANCEL]->(tarCalzado)
CREATE (juguetes)-[:APLICA_ARANCEL]->(tarJuguetes)
CREATE (libros)-[:APLICA_ARANCEL]->(tarLibros)
CREATE (herramientas)-[:APLICA_ARANCEL]->(tarHerramientas)

// Productos ↔ categorías
CREATE (teclado)-[:PERTENECE_A]->(electronica)
CREATE (monitor)-[:PERTENECE_A]->(electronica)
CREATE (zapatillas)-[:PERTENECE_A]->(calzado)
CREATE (lego)-[:PERTENECE_A]->(juguetes)
CREATE (libroClean)-[:PERTENECE_A]->(libros)
CREATE (taladro)-[:PERTENECE_A]->(herramientas)

// Tiendas ↔ países
CREATE (walmart)-[:UBICADA_EN]->(usa)
CREATE (decathlon)-[:UBICADA_EN]->(francia)
CREATE (bookdep)-[:UBICADA_EN]->(uk)
CREATE (mediamarkt)-[:UBICADA_EN]->(alemania)
CREATE (rakuten)-[:UBICADA_EN]->(japon)

// Monedas ↔ cotizaciones
CREATE (gbp)-[:TIENE_COTIZACION]->(cotGbp)
CREATE (jpy)-[:TIENE_COTIZACION]->(cotJpy)

// Métodos de envío ↔ couriers
CREATE (envDecathlon)-[:OPERADO_POR]->(correos)
CREATE (envWalmart)-[:OPERADO_POR]->(fedex)
CREATE (envBookDep)-[:OPERADO_POR]->(correos)
CREATE (envMediaMarkt)-[:OPERADO_POR]->(dhl)
CREATE (envRakuten)-[:OPERADO_POR]->(japanpost)
CREATE (envAliExtra)-[:OPERADO_POR]->(ups)

// ---- Zapatillas ----
CREATE (zapatillas)-[:TIENE_OFERTA]->(ofeZapDecathlon)
CREATE (zapatillas)-[:TIENE_OFERTA]->(ofeZapWalmart)
CREATE (zapatillas)-[:TIENE_OFERTA]->(ofeZapMediamarkt)
CREATE (ofeZapDecathlon)-[:VENDIDA_POR]->(decathlon)
CREATE (ofeZapWalmart)-[:VENDIDA_POR]->(walmart)
CREATE (ofeZapMediamarkt)-[:VENDIDA_POR]->(mediamarkt)
CREATE (ofeZapDecathlon)-[:USA_MONEDA]->(eur)
CREATE (ofeZapWalmart)-[:USA_MONEDA]->(usd)
CREATE (ofeZapMediamarkt)-[:USA_MONEDA]->(eur)
CREATE (ofeZapDecathlon)-[:TIENE_ENVIO]->(envDecathlon)
CREATE (ofeZapWalmart)-[:TIENE_ENVIO]->(envWalmart)
CREATE (ofeZapMediamarkt)-[:TIENE_ENVIO]->(envMediaMarkt)

// ---- LEGO ----
CREATE (lego)-[:TIENE_OFERTA]->(ofeLegoAmazon)
CREATE (lego)-[:TIENE_OFERTA]->(ofeLegoRakuten)
CREATE (lego)-[:TIENE_OFERTA]->(ofeLegoMediamarkt)
CREATE (ofeLegoAmazon)-[:VENDIDA_POR]->(amazon)
CREATE (ofeLegoRakuten)-[:VENDIDA_POR]->(rakuten)
CREATE (ofeLegoMediamarkt)-[:VENDIDA_POR]->(mediamarkt)
CREATE (ofeLegoAmazon)-[:USA_MONEDA]->(usd)
CREATE (ofeLegoRakuten)-[:USA_MONEDA]->(jpy)
CREATE (ofeLegoMediamarkt)-[:USA_MONEDA]->(eur)
CREATE (ofeLegoAmazon)-[:TIENE_ENVIO]->(envWalmart)
CREATE (ofeLegoRakuten)-[:TIENE_ENVIO]->(envRakuten)
CREATE (ofeLegoMediamarkt)-[:TIENE_ENVIO]->(envMediaMarkt)

// ---- Libro ----
CREATE (libroClean)-[:TIENE_OFERTA]->(ofeLibroBookdep)
CREATE (libroClean)-[:TIENE_OFERTA]->(ofeLibroAmazon)
CREATE (ofeLibroBookdep)-[:VENDIDA_POR]->(bookdep)
CREATE (ofeLibroAmazon)-[:VENDIDA_POR]->(amazon)
CREATE (ofeLibroBookdep)-[:USA_MONEDA]->(gbp)
CREATE (ofeLibroAmazon)-[:USA_MONEDA]->(usd)
CREATE (ofeLibroBookdep)-[:TIENE_ENVIO]->(envBookDep)
CREATE (ofeLibroAmazon)-[:TIENE_ENVIO]->(envAliExtra)

// ---- Taladro ----
CREATE (taladro)-[:TIENE_OFERTA]->(ofeTaladroWalmart)
CREATE (taladro)-[:TIENE_OFERTA]->(ofeTaladroMediamarkt)
CREATE (ofeTaladroWalmart)-[:VENDIDA_POR]->(walmart)
CREATE (ofeTaladroMediamarkt)-[:VENDIDA_POR]->(mediamarkt)
CREATE (ofeTaladroWalmart)-[:USA_MONEDA]->(usd)
CREATE (ofeTaladroMediamarkt)-[:USA_MONEDA]->(eur)
CREATE (ofeTaladroWalmart)-[:TIENE_ENVIO]->(envWalmart)
CREATE (ofeTaladroMediamarkt)-[:TIENE_ENVIO]->(envMediaMarkt)

// ---- Teclado ----
CREATE (teclado)-[:TIENE_OFERTA]->(ofeTecladoAli)
CREATE (teclado)-[:TIENE_OFERTA]->(ofeTecladoAmazon)
CREATE (teclado)-[:TIENE_OFERTA]->(ofeTecladoRakuten)
CREATE (ofeTecladoAli)-[:VENDIDA_POR]->(aliexpress)
CREATE (ofeTecladoAmazon)-[:VENDIDA_POR]->(amazon)
CREATE (ofeTecladoRakuten)-[:VENDIDA_POR]->(rakuten)
CREATE (ofeTecladoAli)-[:USA_MONEDA]->(usd)
CREATE (ofeTecladoAmazon)-[:USA_MONEDA]->(usd)
CREATE (ofeTecladoRakuten)-[:USA_MONEDA]->(jpy)
CREATE (ofeTecladoAli)-[:TIENE_ENVIO]->(envAliExtra)
CREATE (ofeTecladoAmazon)-[:TIENE_ENVIO]->(envWalmart)
CREATE (ofeTecladoRakuten)-[:TIENE_ENVIO]->(envRakuten)

// ---- Monitor ----
CREATE (monitor)-[:TIENE_OFERTA]->(ofeMonitorAmazon)
CREATE (monitor)-[:TIENE_OFERTA]->(ofeMonitorMediamarkt)
CREATE (ofeMonitorAmazon)-[:VENDIDA_POR]->(amazon)
CREATE (ofeMonitorMediamarkt)-[:VENDIDA_POR]->(mediamarkt)
CREATE (ofeMonitorAmazon)-[:USA_MONEDA]->(usd)
CREATE (ofeMonitorMediamarkt)-[:USA_MONEDA]->(eur)
CREATE (ofeMonitorAmazon)-[:TIENE_ENVIO]->(envWalmart)
CREATE (ofeMonitorMediamarkt)-[:TIENE_ENVIO]->(envMediaMarkt)

// =============================================================
// COMPRAS Y LOGÍSTICA
// =============================================================

// COM-003: Ana → Zapatillas en Decathlon → ENTREGADO
CREATE (ana)-[:REALIZA]->(compra3)
CREATE (compra3)-[:GENERA]->(orden3)
CREATE (orden3)-[:INCLUYE {cantidad: 1, precioUnitario: 110.0}]->(zapatillas)
CREATE (orden3)-[:GENERA_PAQUETE]->(paq3)
CREATE (paq3)-[:TRANSPORTADO_POR]->(correos)
CREATE (paq3)-[:PASA_POR {fecha: date("2026-05-11"), orden: 1}]->(depositoParis)
CREATE (paq3)-[:PASA_POR {fecha: date("2026-05-13"), orden: 2}]->(aduanaEzeiza)
CREATE (paq3)-[:PASA_POR {fecha: date("2026-05-15"), orden: 3}]->(depBA)
CREATE (paq3)-[:TIENE_ESTADO {fecha: date("2026-05-15")}]->(estadoEntregado)
CREATE (compra3)-[:TIENE_PAGO]->(pago3)
CREATE (pago3)-[:INCLUYE]->(iva)
CREATE (pago3)-[:INCLUYE]->(impPais)
CREATE (paq3)-[:ENTREGADO_EN]->(dir3)

// COM-004: Carlos → LEGO en Rakuten → RETENIDO (arancel 70%)
CREATE (carlos)-[:REALIZA]->(compra4)
CREATE (compra4)-[:GENERA]->(orden4)
CREATE (orden4)-[:INCLUYE {cantidad: 1, precioUnitario: 29800.0}]->(lego)
CREATE (orden4)-[:GENERA_PAQUETE]->(paq4)
CREATE (paq4)-[:TRANSPORTADO_POR]->(japanpost)
CREATE (paq4)-[:PASA_POR {fecha: date("2026-05-13"), orden: 1}]->(depositoOsaka)
CREATE (paq4)-[:PASA_POR {fecha: date("2026-05-15"), orden: 2}]->(aduanaOsaka)
CREATE (paq4)-[:PASA_POR {fecha: date("2026-05-18"), orden: 3}]->(aduanaEzeiza)
CREATE (paq4)-[:TIENE_ESTADO {fecha: date("2026-05-18")}]->(estadoRetenido)
CREATE (paq4)-[:TIENE_INCIDENCIA {fecha: date("2026-05-18")}]->(incArancel)
CREATE (paq4)-[:TIENE_INCIDENCIA {fecha: date("2026-05-18")}]->(incFactura)
CREATE (carlos)-[:DECLARA]->(dj2)
CREATE (dj2)-[:CORRESPONDE_A]->(paq4)
CREATE (compra4)-[:TIENE_PAGO]->(pago4)
CREATE (pago4)-[:INCLUYE]->(iva)
CREATE (pago4)-[:INCLUYE]->(impPais)
CREATE (paq4)-[:ENTREGADO_EN]->(dir4)

// COM-005: María → Teclado en AliExpress → EN TRÁNSITO
CREATE (maria)-[:REALIZA]->(compra5)
CREATE (compra5)-[:GENERA]->(orden5)
CREATE (orden5)-[:INCLUYE {cantidad: 1, precioUnitario: 72.0}]->(teclado)
CREATE (orden5)-[:GENERA_PAQUETE]->(paq5)
CREATE (paq5)-[:TRANSPORTADO_POR]->(cainiao)
CREATE (paq5)-[:PASA_POR {fecha: date("2026-05-16"), orden: 1}]->(depChina)
CREATE (paq5)-[:PASA_POR {fecha: date("2026-05-19"), orden: 2}]->(aduanaEzeiza)
CREATE (paq5)-[:TIENE_ESTADO {fecha: date("2026-05-19")}]->(estadoTransito)
CREATE (paq5)-[:TIENE_INCIDENCIA {fecha: date("2026-05-17")}]->(incEtiqueta)
CREATE (compra5)-[:TIENE_PAGO]->(pago5)
CREATE (pago5)-[:INCLUYE]->(iva)
CREATE (paq5)-[:ENTREGADO_EN]->(dir5)

// COM-006: Pedro → Monitor en MediaMarkt → RETENIDO
CREATE (pedro)-[:REALIZA]->(compra6)
CREATE (compra6)-[:GENERA]->(orden6)
CREATE (orden6)-[:INCLUYE {cantidad: 1, precioUnitario: 195.0}]->(monitor)
CREATE (orden6)-[:GENERA_PAQUETE]->(paq6)
CREATE (paq6)-[:TRANSPORTADO_POR]->(dhl)
CREATE (paq6)-[:PASA_POR {fecha: date("2026-05-17"), orden: 1}]->(depositoFrankfurt)
CREATE (paq6)-[:PASA_POR {fecha: date("2026-05-18"), orden: 2}]->(aduanaFrankfurt)
CREATE (paq6)-[:PASA_POR {fecha: date("2026-05-21"), orden: 3}]->(aduanaEzeiza)
CREATE (paq6)-[:TIENE_ESTADO {fecha: date("2026-05-21")}]->(estadoRetenido)
CREATE (paq6)-[:TIENE_INCIDENCIA {fecha: date("2026-05-21")}]->(incPeso)
CREATE (paq6)-[:TIENE_INCIDENCIA {fecha: date("2026-05-21")}]->(incArancel)
CREATE (pedro)-[:DECLARA]->(dj3)
CREATE (dj3)-[:CORRESPONDE_A]->(paq6)
CREATE (compra6)-[:TIENE_PAGO]->(pago6)
CREATE (pago6)-[:INCLUYE]->(iva)
CREATE (pago6)-[:INCLUYE]->(impPais)
CREATE (paq6)-[:ENTREGADO_EN]->(dir6)

// COM-007: Laura → Taladro en Walmart → ENTREGADO
CREATE (laura)-[:REALIZA]->(compra7)
CREATE (compra7)-[:GENERA]->(orden7)
CREATE (orden7)-[:INCLUYE {cantidad: 1, precioUnitario: 189.0}]->(taladro)
CREATE (orden7)-[:GENERA_PAQUETE]->(paq7)
CREATE (paq7)-[:TRANSPORTADO_POR]->(fedex)
CREATE (paq7)-[:PASA_POR {fecha: date("2026-05-19"), orden: 1}]->(depUSA)
CREATE (paq7)-[:PASA_POR {fecha: date("2026-05-20"), orden: 2}]->(aduanaMiami)
CREATE (paq7)-[:PASA_POR {fecha: date("2026-05-22"), orden: 3}]->(aduanaEzeiza)
CREATE (paq7)-[:PASA_POR {fecha: date("2026-05-23"), orden: 4}]->(depBA)
CREATE (paq7)-[:TIENE_ESTADO {fecha: date("2026-05-23")}]->(estadoEntregado)
CREATE (paq7)-[:TIENE_INCIDENCIA {fecha: date("2026-05-20")}]->(incHuelga)
CREATE (compra7)-[:TIENE_PAGO]->(pago7)
CREATE (pago7)-[:INCLUYE]->(iva)
CREATE (paq7)-[:ENTREGADO_EN]->(dir7)

// COM-008: Facundo → Libro en Book Depository → EN TRÁNSITO
CREATE (facundo)-[:REALIZA]->(compra8)
CREATE (compra8)-[:GENERA]->(orden8)
CREATE (orden8)-[:INCLUYE {cantidad: 1, precioUnitario: 38.0}]->(libroClean)
CREATE (orden8)-[:GENERA_PAQUETE]->(paq8)
CREATE (paq8)-[:TRANSPORTADO_POR]->(ups)
CREATE (paq8)-[:PASA_POR {fecha: date("2026-05-21"), orden: 1}]->(depositoFrankfurt)
CREATE (paq8)-[:PASA_POR {fecha: date("2026-05-22"), orden: 2}]->(aduanaEzeiza)
CREATE (paq8)-[:TIENE_ESTADO {fecha: date("2026-05-22")}]->(estadoTransito)
CREATE (paq8)-[:TIENE_INCIDENCIA {fecha: date("2026-05-21")}]->(incDireccion)
CREATE (compra8)-[:TIENE_PAGO]->(pago8)
CREATE (pago8)-[:INCLUYE]->(iva)
CREATE (paq8)-[:ENTREGADO_EN]->(dir3)
CREATE (pedro)-[:DECLARA]->(dj4)
CREATE (dj4)-[:CORRESPONDE_A]->(paq8)
