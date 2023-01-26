import Express from "express";
import { PrismaClient } from "@prisma/client";
const app = Express()
const prisma = new PrismaClient()

app.get("/", async (req, res) => {
  const planets = await prisma.planets.findMany()
  res.json(planets)
})

app.listen(3000, () => {
  console.log("running")
})