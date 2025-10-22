import express from "express";
import cuentasRouter from "./routes/cuentas.js";

const app = express();
const PORT = 3130;

app.use(express.json());

app.use("/", cuentasRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
