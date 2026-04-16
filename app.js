import express from "express";
import cors from "cors";
import "dotenv/config";

import timbreRouter from "./routes/timbreRoutes.js";  // sin src/
import alarmRouter from "./routes/alarmRoutes.js";    // sin src/
import systemRouter from "./routes/systemRoutes.js";    // sin src/

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Timbre funcionando 🚀");
});

app.use("/api/timbre", timbreRouter);
app.use("/api/alarms", alarmRouter);
app.use("/api/system", systemRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});