import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { Snippet

 } from "../models/SnippetModel";


 export const getAllSnippet = async (req: Request, res: Response) => {
  try {
    const { language, tags, page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;

  
    let filter: any = {};
    if (language) {
      filter.language = { $regex: new RegExp(language as string, "i") }; 
    }
    if (tags) {
      const tagArray = (tags as string).split(",");
      filter.tags = { $all: tagArray.map(tag => new RegExp(tag, "i")) }; 
    }


    const options = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: [[sort as string, order === "asc" ? "asc" : "desc"]],
    };

 
    const snippets = await Snippet.find(filter).skip(options.skip).limit(options.limit).sort(options.sort as any);

 
    const total = await Snippet.countDocuments(filter);

    res.json({ total, page: Number(page), limit: Number(limit), snippets });
  } catch (error) {
    if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: "something went wrong", error });
    }
}
};


