import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { Snippet } from "../models/SnippetModel";

export const getAllSnippet = async (req: Request, res: Response) => {
  try {
    // const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
    const { language } = req.query;
    const { tags } = req.query;
    const { page, limit } = req.query;
    const { sort, order } = req.query;


    // If filtering by language only
    if (language) {
      const filteredSnippets = await Snippet.find({
        language: { $regex: language as string, $options: "i" },
      });
       res
        .status(200)
        .json({ message: "Filtered by language", snippets: filteredSnippets });
        return;
    }

    // If filtering by tags only
    if (tags) {
      const tagArray = (tags as string).split(",");
      const filteredSnippets = await Snippet.find({
        tags: { $all: tagArray.map((tag) => new RegExp(tag, "i")) },
      });
       res
        .status(200)
        .json({ message: "Filtered by tags", snippets: filteredSnippets });
        return
    }

    if (page && limit) {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const snippets = await Snippet.find().skip(skip).limit(limitNumber);
      res.status(200).json({ message: "paginated", snippets });
      return;
    }

    if (sort && order) {
      const sortOptions: any = {};
      sortOptions[sort as string] = order === "asc" ? 1 : -1;
      const snippets = await Snippet.find().sort(sortOptions);
      res.status(200).json({ message: "Sorted", snippets });
      return ;
    }
    const snippets = await Snippet.find();
    res.status(200).json({ message: "All snippets", snippets });
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
    const snippet = await Snippet.create({
      title,
      code,
      language,
      tags,
      expiresIn,
    });
    res.status(201).json({ message: "Snippet added successfully", snippet });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong", error });
    }
  }
};

export const getSnippetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findById(id);

    if (!snippet) {
      res.status(404).json({ message: "Snippet not found" });
      return;
    }

    res.status(200).json({ message: "Snippet fetched successfully", snippet });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};


export const deleteSnippetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findByIdAndDelete(id);

    if (!snippet) {
      res.status(404).json({ message: "Snippet not found" });
      return;
    }

    res.status(200).json({ message: "Snippet deleted successfully", snippet });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};


export const updateSnippetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findByIdAndUpdate(id, req.body, { new: true });

    if (!snippet) {
     res.status(404).json({ message: "Snippet not found" });
      return;
    }

    res.status(200).json({ message: "Snippet updated successfully", snippet });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

