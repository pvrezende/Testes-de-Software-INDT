import { Router } from "express";
import sensorRouter from "./sensorRoutes.js";
import pesquisadorRoutes from "./pesquisadorRoutes.js";
import authRouter from "./authRoutes.js";
import leituraRoutes from "./leituraRouter.js";
import areaRoutes from "./areaRouter.js";


const indexRouter = Router();

indexRouter.use(pesquisadorRoutes);
indexRouter.use(authRouter)
indexRouter.use(sensorRouter);
indexRouter.use(areaRoutes)
indexRouter.use(leituraRoutes)

export default indexRouter;
