import { prisma } from "../config/prisma.js";

const getSystem = async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst();
    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo configuración" });
  }
};

const updateSystem = async (req, res) => {
  try {
    const { systemOn, duration } = req.body;

    const settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    const updated = await prisma.systemSettings.update({
      where: { id: settings.id },
      data: {
        systemOn,
        duration,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando configuración" });
  }
};

export { getSystem, updateSystem };