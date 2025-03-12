import express from "express";

import { getAllSnippet, addNewSnippets, getSnippetById, deleteSnippetById , updateSnippetById} from "../controllers/snippetController";


const router = express.Router();

router
.get("/", getAllSnippet).post("/", addNewSnippets)

router.get("/:id", getSnippetById).delete("/:id", deleteSnippetById).put("/:id", updateSnippetById)

export default router;
