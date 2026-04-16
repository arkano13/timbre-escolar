-- CreateTable
CREATE TABLE "Alarm" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days" INTEGER[],
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Alarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "systemOn" BOOLEAN NOT NULL DEFAULT true,
    "duration" INTEGER NOT NULL DEFAULT 7000,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriggerLog" (
    "id" TEXT NOT NULL,
    "alarmId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "TriggerLog_pkey" PRIMARY KEY ("id")
);
