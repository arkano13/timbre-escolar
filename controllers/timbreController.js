// timbreController.js
import prisma from "../config/prisma.js";

let manualRingUntil = 0;

function pad(n) {
  return String(n).padStart(2, "0");
}

function getDayIndex(date) {
  // lunes=0 ... domingo=6
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

function getDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getTimeKey(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizeDays(days) {
  if (Array.isArray(days)) return days.map(Number);

  if (typeof days === "string") {
    return days
      .replace(/[{}]/g, "")
      .split(",")
      .map((d) => Number(d.trim()))
      .filter((n) => !Number.isNaN(n));
  }

  return [];
}

const getTimbreNow = async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst();

    if (!settings || !settings.systemOn) {
      console.log("Sistema apagado o sin configuración");
      return res.json({ ring: false });
    }

    // Hora de Honduras
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Tegucigalpa" })
    );

    const dayIndex = getDayIndex(now);
    const timeKey = getTimeKey(now);
    const dateKey = getDateKey(now);

    console.log("Fecha Honduras:", now.toString());
    console.log("dayIndex:", dayIndex);
    console.log("timeKey:", timeKey);
    console.log("dateKey:", dateKey);

    // Timbre manual activo
    if (Date.now() < manualRingUntil) {
      console.log("Timbre manual activo");
      return res.json({
        ring: true,
        duration: settings.duration || 7000,
        name: "Manual",
      });
    }

    const alarms = await prisma.alarm.findMany({
      where: { active: true },
    });

    console.log("Alarmas activas:", alarms);

    const hit = alarms.find((a) => {
      const daysArray = normalizeDays(a.days);
      const sameDay = daysArray.includes(dayIndex);
      const sameTime = a.time === timeKey;

      console.log("Comparando alarma:", {
        alarmId: a.id,
        alarmName: a.name,
        alarmTime: a.time,
        alarmDays: a.days,
        normalizedDays: daysArray,
        dayIndex,
        timeKey,
        sameDay,
        sameTime,
      });

      return sameDay && sameTime;
    });

    if (!hit) {
      console.log("No hubo alarma coincidente");
      return res.json({ ring: false });
    }

    // Evitar repetición
    const existing = await prisma.triggerLog.findFirst({
      where: {
        alarmId: hit.id,
        date: dateKey,
        time: hit.time,
      },
    });

    if (existing) {
      console.log("Ya existe triggerLog para esta alarma hoy");
      return res.json({ ring: false });
    }

    await prisma.triggerLog.create({
      data: {
        alarmId: hit.id,
        date: dateKey,
        time: hit.time,
      },
    });

    console.log("ALARMA DISPARADA:", hit.name);

    return res.json({
      ring: true,
      duration: settings.duration || 7000,
      name: hit.name,
    });
  } catch (err) {
    console.error("Error getTimbreNow:", err);
    return res.status(500).json({ error: "Error servidor" });
  }
};

const triggerManualRing = async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst();
    const duration = settings?.duration || 7000;

    manualRingUntil = Date.now() + duration;

    console.log("Timbre manual activado por", duration, "ms");

    return res.status(200).json({
      ring: true,
      manual: true,
      duration,
    });
  } catch (error) {
    console.error("Error activando timbre manual:", error);
    return res.status(500).json({
      ring: false,
      message: "Error activando timbre manual",
    });
  }
};

export { getTimbreNow, triggerManualRing };