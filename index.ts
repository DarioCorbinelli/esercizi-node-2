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

app.get("/planets/:id", async (req, res) => {
  const planetID = req.params.id
  const planet = await prisma.planets.findUnique({
    where: {
      id: +planetID
    }
  })

  res.json(planet)
})

app.post("/", validate({ body: planetSchema }), async (req, res) => {
  const body: PlanetData = req.body
  const planet = await prisma.planets.create({
    data: {...body}
  })
  res.json(planet)
})

app.put("/planets/:id",async (req, res) => {
  const planetID = req.params.id
  const updatedData = req.body

  const updatedPlanet = await prisma.planets.update({
    where: {id: +planetID},
    data: {...updatedData}
  })

  res.json(updatedPlanet)
})

app.delete("/planets/:id",async (req, res) => {
  const planetID = +req.params.id
  const deletedPlanet = await prisma.planets.delete({
    where: {id: planetID}
  })

  res.json(deletedPlanet)
})

app.use(validationErrorMiddleware)

app.listen(3000, () => {
  console.log("running")
})