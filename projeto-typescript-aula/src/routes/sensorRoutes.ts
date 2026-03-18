import { Router } from "express";
import SensorController from "../controllers/SensorController.js";
import SensorService from "../services/SensorService.js";
import { validarBody } from "../middleware/validarBody.js";

import { authMiddleware } from "../middleware/authMidd.js";
import { createSensorSchema } from "../validats/createSensorSchema.js";

const sensorRouter = Router();
const sensorService = new SensorService();
const sensorController = new SensorController(sensorService);

// Aplica autenticação em todas as rotas de sensor
//sensorRouter.use(authMiddleware);

sensorRouter.get('/sensors', (req, res) => sensorController.getAllSensors(req, res));
sensorRouter.post('/sensors', validarBody(createSensorSchema), (req, res) => sensorController.addSensor(req, res));
sensorRouter.put('/sensors/:id', (req, res) => sensorController.updateSensor(req, res));
sensorRouter.delete('/sensors/:id', (req, res) => sensorController.deleteSensor(req, res));

export default sensorRouter;