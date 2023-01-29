import express from "express";

import { validationErrorMiddleware } from "./validation";
import { initCorsMiddleware } from "./lib/middleware/cors";

import planetsRoutes from "./src/routes/planets"

const app = express()

app.use(express.json())

app.use(initCorsMiddleware())

app.use("/planets", planetsRoutes)

app.use(validationErrorMiddleware)

export default app