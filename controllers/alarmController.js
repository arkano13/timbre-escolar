import prisma from "../config/prisma.js";

// GET
const getAllAlarms = async (req, res) => {
  const alarms = await prisma.alarm.findMany({
    orderBy: { time: "asc" },
  });
  res.json(alarms);
};

// POST
const createAlarm = async (req, res) => {
  const { time, name, days } = req.body;

  const alarm = await prisma.alarm.create({
    data: {
      time,
      name: name || "Timbre",
      days,
    },
  });

  res.status(201).json(alarm);
};

// DELETE
const deleteAlarm = async (req, res) => {
  const { id } = req.params;

  await prisma.alarm.delete({
    where: { id },
  });

  res.json({ message: "Eliminado" });
};

// TOGGLE
const toggleAlarm = async (req, res) => {
  const { id } = req.params;

  const alarm = await prisma.alarm.findUnique({
    where: { id },
  });

  const updated = await prisma.alarm.update({
    where: { id },
    data: {
      active: !alarm.active,
    },
  });

  res.json(updated);
};

export {
  getAllAlarms,
  createAlarm,
  deleteAlarm,
  toggleAlarm,
};