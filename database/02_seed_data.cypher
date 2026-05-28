// Limpiar base
MATCH (n)
DETACH DELETE n;

// Clientes
CREATE (facundo:Cliente {
  id: "CLI-001",
  nombre: "Facundo Soria",
  email: "facundo@mail.com",
  telefono: "3510000000"
});

CREATE (nico:Cliente {
  id: "CLI-002",
  nombre: "Nicolás Gómez",
  email: "nico@mail.com",
  telefono: "3511111111"
});

// Categorías
CREATE (electronica:CategoriaProducto {
  id: "CAT-001",
  nombre: "Electrónica",
  descripcion: "Productos electrónicos importados"
});

CREATE (ropa:CategoriaProducto {
  id: "CAT-002",
  nombre: "Ropa",
  descripcion: "Indumentaria importada"
});

// Tarifas arancelarias
CREATE (tarElectronica:TarifaArancelaria {
  id: "TAR-001",
  porcentaje: 50.0,
  descripcion: "Arancel para electrónica"
});

CREATE (tarRopa:TarifaArancelaria {
  id: "TAR-002",
  porcentaje: 35.0,
  descripcion: "Arancel para indumentaria"
});

// Productos
CREATE (smartwatch:Producto {
  id: "PROD-001",
  nombre: "Smartwatch Xiaomi Band 8",
  marca: "Xiaomi",
  modelo: "Band 8",
  descripcion: "Reloj inteligente con monitoreo de salud"
});

CREATE (auriculares:Producto {
  id: "PROD-002",
  nombre: "Auriculares Sony WH-CH520",
  marca: "Sony",
  modelo: "WH-CH520",
  descripcion: "Auriculares inalámbricos con cancelación de ruido"
});

CREATE (remera:Producto {
  id: "PROD-003",
  nombre: "Remera Nike Dri-FIT",
  marca: "Nike",
  modelo: "Dri-FIT",
  descripcion: "Remera deportiva transpirable"
});

// Países
CREATE (china:PaisOrigen {
  codigo: "CN",
  nombre: "China",
  region: "Asia"
});

CREATE (usa:PaisOrigen {
  codigo: "US",
  nombre: "Estados Unidos",
  region: "América del Norte"
});

CREATE (espana:PaisOrigen {
  codigo: "ES",
  nombre: "España",
  region: "Europa"
});

CREATE (reino:PaisOrigen {
  codigo: "UK",
  nombre: "Reino Unido",
  region: "Europa"
});

// Tiendas
CREATE (aliexpress:TiendaExterior {
  id: "TIE-001",
  nombre: "AliExpress",
  tipo: "Marketplace",
  reputacion: 4.5
});

CREATE (amazon:TiendaExterior {
  id: "TIE-002",
  nombre: "Amazon",
  tipo: "Marketplace",
  reputacion: 4.8
});

CREATE (ebay:TiendaExterior {
  id: "TIE-003",
  nombre: "eBay España",
  tipo: "Marketplace",
  reputacion: 4.2
});

// Monedas
CREATE (usd:Moneda {
  codigo: "USD",
  nombre: "Dólar estadounidense",
  simbolo: "US$"
});

CREATE (eur:Moneda {
  codigo: "EUR",
  nombre: "Euro",
  simbolo: "€"
});

CREATE (cny:Moneda {
  codigo: "CNY",
  nombre: "Yuan chino",
  simbolo: "¥"
});

// Cotizaciones a ARS
CREATE (cotUsd:Cotizacion {
  id: "COT-USD-001",
  monedaDestino: "ARS",
  valor: 1000.0,
  fecha: date("2026-05-23")
});

CREATE (cotEur:Cotizacion {
  id: "COT-EUR-001",
  monedaDestino: "ARS",
  valor: 1100.0,
  fecha: date("2026-05-23")
});

CREATE (cotCny:Cotizacion {
  id: "COT-CNY-001",
  monedaDestino: "ARS",
  valor: 140.0,
  fecha: date("2026-05-23")
});

// Ofertas del smartwatch
CREATE (ofertaAli:OfertaProducto {
  id: "OFE-001",
  precio: 45.0,
  condicion: "Nuevo",
  stockDisponible: true,
  urlReferencia: "https://aliexpress.com/xiaomi-band"
});

CREATE (ofertaAmazon:OfertaProducto {
  id: "OFE-002",
  precio: 60.0,
  condicion: "Nuevo",
  stockDisponible: true,
  urlReferencia: "https://amazon.com/xiaomi-band"
});

CREATE (ofertaEbay:OfertaProducto {
  id: "OFE-003",
  precio: 55.0,
  condicion: "Nuevo",
  stockDisponible: true,
  urlReferencia: "https://ebay.es/xiaomi-band"
});

// Oferta de auriculares
CREATE (ofertaAuriculares:OfertaProducto {
  id: "OFE-004",
  precio: 89.0,
  condicion: "Nuevo",
  stockDisponible: true,
  urlReferencia: "https://amazon.com/sony-ch520"
});

// Oferta de remera
CREATE (ofertaRemera:OfertaProducto {
  id: "OFE-005",
  precio: 35.0,
  condicion: "Nuevo",
  stockDisponible: true,
  urlReferencia: "https://ebay.es/nike-dri-fit"
});

// Métodos de envío
CREATE (envioAli:MetodoEnvio {
  id: "ENV-001",
  nombre: "Standard Shipping",
  costo: 12.0,
  diasEstimados: 25,
  tipo: "Estándar"
});

CREATE (envioAmazon:MetodoEnvio {
  id: "ENV-002",
  nombre: "Priority International",
  costo: 20.0,
  diasEstimados: 10,
  tipo: "Prioritario"
});

CREATE (envioEbay:MetodoEnvio {
  id: "ENV-003",
  nombre: "Economy Europe",
  costo: 18.0,
  diasEstimados: 18,
  tipo: "Económico"
});

CREATE (envioAmazon2:MetodoEnvio {
  id: "ENV-004",
  nombre: "Express International",
  costo: 25.0,
  diasEstimados: 7,
  tipo: "Express"
});

// Couriers
CREATE (cainiao:Courier {
  id: "COU-001",
  nombre: "Cainiao",
  tipo: "Internacional",
  calificacion: 3.9
});

CREATE (dhl:Courier {
  id: "COU-002",
  nombre: "DHL",
  tipo: "Internacional",
  calificacion: 4.7
});

CREATE (correos:Courier {
  id: "COU-003",
  nombre: "Correos",
  tipo: "Internacional",
  calificacion: 3.8
});

// Compra 1 - Facundo compra smartwatch
CREATE (compra1:Compra {
  id: "COM-001",
  fecha: date("2026-05-23"),
  estado: "Confirmada"
});

CREATE (orden1:Orden {
  id: "ORD-001",
  numeroOrden: "ALI-2026-0001",
  fecha: date("2026-05-23")
});

// Compra 2 - Nico compra auriculares
CREATE (compra2:Compra {
  id: "COM-002",
  fecha: date("2026-05-20"),
  estado: "En camino"
});

CREATE (orden2:Orden {
  id: "ORD-002",
  numeroOrden: "AMZ-2026-0002",
  fecha: date("2026-05-20")
});

// Paquetes
CREATE (paquete1:Paquete {
  codigo: "PKG-9001",
  pesoKg: 0.5,
  fechaCreacion: date("2026-05-23"),
  trackingCode: "TRK-CN-9001"
});

CREATE (paquete2:Paquete {
  codigo: "PKG-9002",
  pesoKg: 0.8,
  fechaCreacion: date("2026-05-20"),
  trackingCode: "TRK-US-9002"
});

// Lugares logísticos
CREATE (depositoChina:Deposito {
  id: "DEP-001",
  nombre: "Depósito Shanghái",
  ciudad: "Shanghái",
  pais: "China"
});

CREATE (depositoArg:Deposito {
  id: "DEP-002",
  nombre: "Centro Logístico Buenos Aires",
  ciudad: "Buenos Aires",
  pais: "Argentina"
});

CREATE (depositoUSA:Deposito {
  id: "DEP-003",
  nombre: "Depósito Miami",
  ciudad: "Miami",
  pais: "Estados Unidos"
});

CREATE (aduanaEzeiza:Aduana {
  id: "ADU-001",
  nombre: "Aduana Ezeiza",
  ciudad: "Buenos Aires",
  pais: "Argentina"
});

CREATE (aduanaMiami:Aduana {
  id: "ADU-002",
  nombre: "Aduana Miami",
  ciudad: "Miami",
  pais: "Estados Unidos"
});

// Estados de envío
CREATE (estadoTransito:EstadoEnvio {
  id: "EST-001",
  nombre: "En tránsito",
  descripcion: "El paquete está siendo transportado"
});

CREATE (estadoRetenido:EstadoEnvio {
  id: "EST-002",
  nombre: "Retenido en aduana",
  descripcion: "El paquete está retenido para control aduanero"
});

CREATE (estadoEntregado:EstadoEnvio {
  id: "EST-003",
  nombre: "Entregado",
  descripcion: "El paquete fue entregado al destinatario"
});

// Incidencias
CREATE (incDoc:Incidencia {
  id: "INC-001",
  tipo: "Documentación faltante",
  descripcion: "Falta declaración jurada del comprador",
  gravedad: "Media"
});

CREATE (incDemora:Incidencia {
  id: "INC-002",
  tipo: "Demora logística",
  descripcion: "Demora por congestión en depósito de Shanghái",
  gravedad: "Baja"
});

// Declaraciones juradas
CREATE (dj1:DeclaracionJurada {
  id: "DJ-001",
  fechaPresentacion: date("2026-05-24"),
  estado: "Pendiente"
});

// Pagos e impuestos
CREATE (pago1:Pago {
  id: "PAG-001",
  monto: 85500.0,
  fecha: date("2026-05-23"),
  medioPago: "Tarjeta"
});

CREATE (pago2:Pago {
  id: "PAG-002",
  monto: 171585.0,
  fecha: date("2026-05-20"),
  medioPago: "Transferencia"
});

CREATE (iva:Impuesto {
  id: "IMP-001",
  nombre: "IVA importación",
  porcentaje: 21.0,
  descripcion: "Impuesto al valor agregado por importación"
});

// Direcciones de entrega
CREATE (direccion1:DireccionEntrega {
  id: "DIR-001",
  calle: "Av. Siempre Viva",
  numero: "742",
  ciudad: "Córdoba",
  provincia: "Córdoba",
  pais: "Argentina",
  codigoPostal: "5000"
});

CREATE (direccion2:DireccionEntrega {
  id: "DIR-002",
  calle: "San Martín",
  numero: "1250",
  ciudad: "Rosario",
  provincia: "Santa Fe",
  pais: "Argentina",
  codigoPostal: "2000"
});

// ===================== RELACIONES =====================

// Categorías y aranceles
CREATE (electronica)-[:APLICA_ARANCEL]->(tarElectronica);
CREATE (ropa)-[:APLICA_ARANCEL]->(tarRopa);

// Productos y categorías
CREATE (smartwatch)-[:PERTENECE_A]->(electronica);
CREATE (auriculares)-[:PERTENECE_A]->(electronica);
CREATE (remera)-[:PERTENECE_A]->(ropa);

// Productos y ofertas
CREATE (smartwatch)-[:TIENE_OFERTA]->(ofertaAli);
CREATE (smartwatch)-[:TIENE_OFERTA]->(ofertaAmazon);
CREATE (smartwatch)-[:TIENE_OFERTA]->(ofertaEbay);
CREATE (auriculares)-[:TIENE_OFERTA]->(ofertaAuriculares);
CREATE (remera)-[:TIENE_OFERTA]->(ofertaRemera);

// Ofertas y tiendas
CREATE (ofertaAli)-[:VENDIDA_POR]->(aliexpress);
CREATE (ofertaAmazon)-[:VENDIDA_POR]->(amazon);
CREATE (ofertaEbay)-[:VENDIDA_POR]->(ebay);
CREATE (ofertaAuriculares)-[:VENDIDA_POR]->(amazon);
CREATE (ofertaRemera)-[:VENDIDA_POR]->(ebay);

// Tiendas y países
CREATE (aliexpress)-[:UBICADA_EN]->(china);
CREATE (amazon)-[:UBICADA_EN]->(usa);
CREATE (ebay)-[:UBICADA_EN]->(espana);

// Ofertas y monedas
CREATE (ofertaAli)-[:USA_MONEDA]->(usd);
CREATE (ofertaAmazon)-[:USA_MONEDA]->(usd);
CREATE (ofertaEbay)-[:USA_MONEDA]->(eur);
CREATE (ofertaAuriculares)-[:USA_MONEDA]->(usd);
CREATE (ofertaRemera)-[:USA_MONEDA]->(eur);

// Monedas y cotizaciones
CREATE (usd)-[:TIENE_COTIZACION]->(cotUsd);
CREATE (eur)-[:TIENE_COTIZACION]->(cotEur);
CREATE (cny)-[:TIENE_COTIZACION]->(cotCny);

// Ofertas y métodos de envío
CREATE (ofertaAli)-[:TIENE_ENVIO]->(envioAli);
CREATE (ofertaAmazon)-[:TIENE_ENVIO]->(envioAmazon);
CREATE (ofertaEbay)-[:TIENE_ENVIO]->(envioEbay);
CREATE (ofertaAuriculares)-[:TIENE_ENVIO]->(envioAmazon2);
CREATE (ofertaRemera)-[:TIENE_ENVIO]->(envioEbay);

// Métodos de envío y couriers
CREATE (envioAli)-[:OPERADO_POR]->(cainiao);
CREATE (envioAmazon)-[:OPERADO_POR]->(dhl);
CREATE (envioEbay)-[:OPERADO_POR]->(correos);
CREATE (envioAmazon2)-[:OPERADO_POR]->(dhl);

// Compra 1 - Facundo
CREATE (facundo)-[:REALIZA]->(compra1);
CREATE (compra1)-[:GENERA]->(orden1);
CREATE (orden1)-[:INCLUYE {cantidad: 1, precioUnitario: 45.0}]->(smartwatch);
CREATE (orden1)-[:GENERA_PAQUETE]->(paquete1);
CREATE (paquete1)-[:TRANSPORTADO_POR]->(cainiao);
CREATE (paquete1)-[:PASA_POR {fecha: date("2026-05-24"), orden: 1}]->(depositoChina);
CREATE (paquete1)-[:PASA_POR {fecha: date("2026-05-28"), orden: 2}]->(aduanaEzeiza);
CREATE (paquete1)-[:PASA_POR {fecha: date("2026-05-30"), orden: 3}]->(depositoArg);
CREATE (paquete1)-[:TIENE_ESTADO {fecha: date("2026-05-28")}]->(estadoRetenido);
CREATE (paquete1)-[:TIENE_INCIDENCIA {fecha: date("2026-05-28")}]->(incDoc);
CREATE (paquete1)-[:TIENE_INCIDENCIA {fecha: date("2026-05-25")}]->(incDemora);
CREATE (facundo)-[:DECLARA]->(dj1);
CREATE (dj1)-[:CORRESPONDE_A]->(paquete1);
CREATE (compra1)-[:TIENE_PAGO]->(pago1);
CREATE (pago1)-[:INCLUYE]->(iva);
CREATE (paquete1)-[:ENTREGADO_EN]->(direccion1);

// Compra 2 - Nico
CREATE (nico)-[:REALIZA]->(compra2);
CREATE (compra2)-[:GENERA]->(orden2);
CREATE (orden2)-[:INCLUYE {cantidad: 1, precioUnitario: 89.0}]->(auriculares);
CREATE (orden2)-[:GENERA_PAQUETE]->(paquete2);
CREATE (paquete2)-[:TRANSPORTADO_POR]->(dhl);
CREATE (paquete2)-[:PASA_POR {fecha: date("2026-05-21"), orden: 1}]->(depositoUSA);
CREATE (paquete2)-[:PASA_POR {fecha: date("2026-05-22"), orden: 2}]->(aduanaMiami);
CREATE (paquete2)-[:PASA_POR {fecha: date("2026-05-23"), orden: 3}]->(aduanaEzeiza);
CREATE (paquete2)-[:TIENE_ESTADO {fecha: date("2026-05-23")}]->(estadoTransito);
CREATE (compra2)-[:TIENE_PAGO]->(pago2);
CREATE (pago2)-[:INCLUYE]->(iva);
CREATE (paquete2)-[:ENTREGADO_EN]->(direccion2);
