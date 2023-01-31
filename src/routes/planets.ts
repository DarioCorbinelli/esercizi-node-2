import express, { Router } from "express";

import { PrismaClient } from "@prisma/client";
import { validate, planetSchema, PlanetData } from "../../validation";
import { initMulterMiddleware } from "../../lib/middleware/multer";
import { checkAuthorization } from "../../lib/middleware/passport";

const upload = initMulterMiddleware()
const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  const planets = await prisma.planets.findMany()
  res.json(planets)
})

router.get("/:id", async (req, res) => {
  const planetID = req.params.id
  const planet = await prisma.planets.findUnique({
    where: {
      id: +planetID
    }
  })

  res.json(planet)
})

router.post("/", checkAuthorization, validate({ body: planetSchema }), async (req, res) => {
  const body: PlanetData = req.body
  const username = req.user?.username as string

  const planet = await prisma.planets.create({
    data: {...body, createdBy: username, updatedBy: username}
  })
  res.json(planet)
})

router.put("/:id", checkAuthorization, async (req, res) => {
  const planetID = req.params.id
  const updatedData = req.body
  const username = req.user?.username as string

  const updatedPlanet = await prisma.planets.update({
    where: {id: +planetID},
    data: {...updatedData, updatedBy: username}
  })

  res.json(updatedPlanet)
})

router.delete("/:id",checkAuthorization, async (req, res) => {
  const planetID = +req.params.id
  const deletedPlanet = await prisma.planets.delete({
    where: {id: planetID}
  })

  res.json(deletedPlanet)
})

router.post("/:id(\\d+)/photo", checkAuthorization, upload.single("photo"), async (req, res, next) => {

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

router.use("/photos", express.static("uploads"))


export default router