import express from "express";

import { getAllSnippet, addNewSnippets} from "../controllers/snippetController";


const router = express.Router();

router
.get("/", getAllSnippet).post("/", addNewSnippets);

export default router;
