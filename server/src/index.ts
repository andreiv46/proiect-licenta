import express from "express";
import logger from "./utils/logger";
import "dotenv/config";

const app = express();
app.use(express.json());

app.get("/", (_req, _res) => {
  logger.error("MAAAAAAAAAAAI");
  _res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
