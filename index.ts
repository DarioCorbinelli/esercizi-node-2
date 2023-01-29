import Express from "express";
import { PrismaClient } from "@prisma/client";
import { validate, validationErrorMiddleware, planetSchema, PlanetData } from "./validation";
import cors from "cors";
import { initMulterMiddleware } from "./lib/middleware/multer";

const upload = initMulterMiddleware()

const app = Express()
const prisma = new PrismaClient()

app.use(Express.json())

const corsOptions = {
  origin: "http://localhost:8080"
}
app.use(cors(corsOptions))

app.get("/planets", async (req, res) => {
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

app.post("/planets", validate({ body: planetSchema }), async (req, res) => {
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

app.post("/planets/:id(\\d+)/photo", upload.single("photo"), async (req, res, next) => {

  if (!req.file) {
    res.status(400)
    return next("No photo file uploaded")
  }

  const planetID = Number(req.params.id)
  const photoFileName = req.file.filename

  try {
    await prisma.planets.update({
      where: {
        id: planetID
      },
      data: {
        photoFilename: photoFileName
      }
    })
  } catch (e) {
    res.status(404)
    next(`Cannot POST /planets/${planetID}/photo`)
  }
})

app.use("/planets/photos", Express.static("uploads"))

app.use(validationErrorMiddleware)

app.listen(3000, () => {
  console.log("running")
})