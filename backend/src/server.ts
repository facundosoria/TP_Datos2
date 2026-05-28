import app from "./app";
import dotenv from "dotenv";
import { driver } from "./config/neo4j.config";

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await driver.verifyConnectivity();
    console.log("Conectado a Neo4j correctamente");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con Neo4j:", error);
    process.exit(1);
  }
};

start();
