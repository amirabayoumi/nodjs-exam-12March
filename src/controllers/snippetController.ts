import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { Snippet } from "../models/SnippetModel";

export const getAllSnippet = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
    const { language } = req.query;
    const { tags } = req.query;

    // If filtering by language only
    if (language) {
      const filteredSnippets = await Snippet.find({ 
        language: { $regex: language as string, $options: "i" }
      });
      return res.status(200).json({ message: "Filtered by language", snippets: filteredSnippets });
    }

    // If filtering by tags only
    if (tags) {
      const tagArray = (tags as string).split(",");
      const filteredSnippets = await Snippet.find({ 
        tags: { $all: tagArray.map(tag => new RegExp(tag, "i")) }
      });
      return res.status(200).json({ message: "Filtered by tags", snippets: filteredSnippets });
    }

    // If no filters were provided, return all snippets with pagination and sorting
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting options
    const sortOptions: any = {};
    sortOptions[sort as string] = order === "asc" ? 1 : -1;

    // Fetch all snippets with pagination & sorting
    const snippets = await Snippet.find({})
      .skip(skip)
      .limit(limitNumber)
      .sort(sortOptions);

    // Get total count of all snippets
    const total = await Snippet.countDocuments({});

    // Send response
    res.status(200).json({
      message: "Fetched all snippets",
      total,
      page: pageNumber,
      limit: limitNumber,
      snippets,
    });

  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong", error });
    }
  }
};


export const addNewSnippets = async (req: Request, res: Response) => {
  try {
    const { title, code, language, tags, expiresIn } = req.body;
    const snippet = await Snippet.create({ title, code, language, tags, expiresIn });    
    res.status(201).json({ message: "Snippet added successfully", snippet }); 
  }catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong", error });
    }
  }}


 