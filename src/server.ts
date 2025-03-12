// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import { notFound } from "./controllers/notFoundController";
// import testRoutes from "./routes/exampleRoutes";
import { helloMiddleware } from "./middleware/exampleMiddleware";
import mongoose from "mongoose";
import { Snippet } from "./models/SnippetModel";

import snippetRoutes from "./routes/snippetsRoutes";
// Variables
const app = express();
const PORT = process.env.PORT || 5001

// Middleware
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("src/public"));
app.get("/", async (req, res) => {
  try {
    const snippets = await Snippet.find();
    // Pass the snippets data to the view (index.ejs)
    res.render("index", { message: "Welcome to the app!", snippets });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
// Routes
app.use("/api/snippets", snippetRoutes);
app.all("*", notFound);

// Database connection
try {
  await mongoose.connect(process.env.MONGO_URI_LIVE!);
  console.log("Database connection OK");
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Server Listening
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}! 🚀`);
});
