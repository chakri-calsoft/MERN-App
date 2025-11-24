import dotenv from "dotenv";
import app from "./app.js";
import { PORT } from "./config/constanst.js";
import connectDB from "./config/database.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

startServer();
