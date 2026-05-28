import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const USERS = [
  { username: "admin", password: "admin1234", nombre: "Administrador" },
  { username: "facundo", password: "facundo123", nombre: "Facundo Soria" },
];

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuario y contraseña requeridos" });
  }

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { username: user.username, nombre: user.nombre },
    process.env.JWT_SECRET ?? "importtrace_secret_2024",
    { expiresIn: "8h" }
  );

  res.json({ token, user: { username: user.username, nombre: user.nombre } });
};
