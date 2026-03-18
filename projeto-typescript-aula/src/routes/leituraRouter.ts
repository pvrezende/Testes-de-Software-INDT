import { Router } from "express";
import LeituraController from "../controllers/LeituraController.js";
import LeituraService from "../services/LeituraService.js";
import { validarBody } from "../middleware/validarBody.js";
import { createLeituraSchema } from "../validats/createLeituraSchema.js";

const leituraRoutes = Router();
const leituraService = new LeituraService();
const leituraController = new LeituraController(leituraService);

leituraRoutes.post("/leitura", validarBody(createLeituraSchema), (req, res) => leituraController.create(req, res));
leituraRoutes.get("/leitura", (req, res) => leituraController.findAll(req, res));
leituraRoutes.get("/leitura/:id", (req, res) => leituraController.findById(req, res));
leituraRoutes.put("/leitura/:id",  (req, res) => leituraController.update(req, res));
leituraRoutes.delete("/leitura/:id", (req, res) => leituraController.delete(req, res));
leituraRoutes.get("/leitura/area/:areaId", (req, res) => leituraController.listarLeiturasPorArea(req, res));

export default leituraRoutes;