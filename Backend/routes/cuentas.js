import express from "express";
import { getCuentas, getCuentaById, getCuentasBalance } from "../controllers/cuentasController.js";

const router = express.Router();

router.get("/cuentas", getCuentas);
router.get("/cuenta/:id", getCuentaById);
router.get("/cuentasBalance", getCuentasBalance);

export default router;
