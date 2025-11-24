import express from "express";
import cors from "cors";
import router from "./routes/user.route.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.use("/api", router);

export default app;
