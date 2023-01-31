import express from "express";

import { validationErrorMiddleware } from "./validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import { initSessionMiddleware } from "./lib/middleware/session";
import { passport } from "./lib/middleware/passport";

import planetsRoutes from "./src/routes/planets"
import authRoutes from "./src/routes/auth"

const app = express()

app.use(initSessionMiddleware())
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())

app.use(initCorsMiddleware())

app.use("/planets", planetsRoutes)
app.use("/auth", authRoutes)

app.use(validationErrorMiddleware)

export default app