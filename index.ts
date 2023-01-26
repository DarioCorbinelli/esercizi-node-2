import Express from "express";
import { PrismaClient } from "@prisma/client";
import { validate, validationErrorMiddleware, planetSchema, PlanetData } from "./validation";

const app = Express()
const prisma = new PrismaClient()

app.use(Express.json())

app.get("/", async (req, res) => {
  const planets = await prisma.planets.findMany()
  res.json(planets)
})

app.post("/", validate({ body: planetSchema }), async (req, res) => {
  const body: PlanetData = req.body
  const planet = await prisma.planets.create({
    data: {...body}
  })
  res.json(planet)
})

app.use(validationErrorMiddleware)

app.listen(3000, () => {
  console.log("running")
})