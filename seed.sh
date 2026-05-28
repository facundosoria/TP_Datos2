#!/bin/bash
# seed.sh — Carga los datos iniciales en Neo4j (ejecutar solo una vez)
# Uso: ./seed.sh
# Requiere que los contenedores estén corriendo: docker compose up -d

set -e

CONTAINER="importtrace-neo4j"
FILES=(
  "database/01_constraints.cypher"
  "database/02_seed_data.cypher"
  "database/03_more_data.cypher"
  "database/04_aranceles_pais.cypher"
  "database/05_more_data.cypher"
  "database/06_fix_seed02.cypher"
)

echo "⏳ Esperando que Neo4j esté listo..."
until docker exec "$CONTAINER" cypher-shell -u neo4j -p admin1234 "RETURN 1" &>/dev/null; do
  echo "   ...todavía iniciando, reintentando en 3s"
  sleep 3
done

echo "✅ Neo4j listo. Cargando datos..."
echo ""

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Archivo no encontrado: $file — saltando"
    continue
  fi
  echo "📄 $file"
  docker exec -i "$CONTAINER" cypher-shell -u neo4j -p admin1234 < "$file"
done

echo ""
echo "✅ Base de datos cargada correctamente."
echo "   App: http://localhost"
echo "   Neo4j Browser: http://localhost:7474"
