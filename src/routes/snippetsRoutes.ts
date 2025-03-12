import express from "express";

import { getAllSnippet} from "../controllers/snippetController";


const router = express.Router();

router
.get("/", getAllSnippet);

export default router;
