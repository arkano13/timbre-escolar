// timbreController.js
import prisma from '../config/prisma.js'  // sin llaves {}

function pad(n) {
  return String(n).padStart(2, "0");
}

function getDayIndex(date) {
  return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

function getDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
}

function getTimeKey(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const getTimbreNow = async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst();

    if (!settings || !settings.systemOn) {
      return res.json({ ring: false });
    }

    const now = new Date();
    const dayIndex = getDayIndex(now);
    const timeKey = getTimeKey(now);
    const dateKey = getDateKey(now);

    const alarms = await prisma.alarm.findMany({
      where: { active: true },
    });

    const hit = alarms.find(
      (a) =>
        a.time === timeKey &&
        a.days.includes(dayIndex)
    );

    if (!hit) {
      return res.json({ ring: false });
    }

    // evitar repetición
    const existing = await prisma.triggerLog.findFirst({
      where: {
        alarmId: hit.id,
        date: dateKey,
        time: timeKey,
      },
    });

    if (existing) {
      return res.json({ ring: false });
    }

    await prisma.triggerLog.create({
      data: {
        alarmId: hit.id,
        date: dateKey,
        time: timeKey,
      },
    });

    return res.json({
      ring: true,
      duration: settings.duration,
      name: hit.name,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error servidor" });
  }
};

export { getTimbreNow };