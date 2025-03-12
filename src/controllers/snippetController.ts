import { Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
const { ValidationError } = MongooseError;
import { Snippet } from "../models/SnippetModel";


//get all snippets without decoded 



// export const getAllSnippet = async (req: Request, res: Response) => {
//   try {
//     // const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
//     const { language } = req.query;
//     const { tags } = req.query;
//     const { page, limit } = req.query;
//     const { sort, order } = req.query;


//     // If filtering by language only
//     if (language) {
//       const filteredSnippets = await Snippet.find({
//         language: { $regex: language as string, $options: "i" },
//       });
//        res
//         .status(200)
//         .json({ message: "Filtered by language", snippets: filteredSnippets });
//         return;
//     }

//     // If filtering by tags only
//     if (tags) {
//       const tagArray = (tags as string).split(",");
//       const filteredSnippets = await Snippet.find({
//         tags: { $all: tagArray.map((tag) => new RegExp(tag, "i")) },
//       });
//        res
//         .status(200)
//         .json({ message: "Filtered by tags", snippets: filteredSnippets });
//         return
//     }

//     if (page && limit) {
//       const pageNumber = Number(page);
//       const limitNumber = Number(limit);
//       const skip = (pageNumber - 1) * limitNumber;

//       const snippets = await Snippet.find().skip(skip).limit(limitNumber);
//       res.status(200).json({ message: "paginated", snippets });
//       return;
//     }

//     if (sort && order) {
//       const sortOptions: any = {};
//       sortOptions[sort as string] = order === "asc" ? 1 : -1;
//       const snippets = await Snippet.find().sort(sortOptions);
//       res.status(200).json({ message: "Sorted", snippets });
//       return ;
//     }
//     const snippets = await Snippet.find();
//     res.status(200).json({ message: "All snippets", snippets });
//   } catch (error) {
//     if (error instanceof ValidationError) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: "Something went wrong", error });
//     }
//   }
// };



//get all snippets decoded 

export const getAllSnippet = async (req: Request, res: Response) => {
  try {
    const { language } = req.query;
    const { tags } = req.query;
    const { page, limit } = req.query;
    const { sort, order } = req.query;

    let snippets = [];

    // If filtering by language only
    if (language) {
      snippets = await Snippet.find({
        language: { $regex: language as string, $options: "i" },
      });
      snippets = snippets.map(snippet => ({
        ...snippet.toObject(),
        code: Buffer.from(snippet.code, "base64").toString("utf-8"),
      }));
      res.status(200).json({ message: "Filtered by language", snippets });
      return
    }

    // If filtering by tags only
    if (tags) {
      const tagArray = (tags as string).split(",");
      snippets = await Snippet.find({
        tags: { $all: tagArray.map((tag) => new RegExp(tag, "i")) },
      });
      snippets = snippets.map(snippet => ({
        ...snippet.toObject(),
        code: Buffer.from(snippet.code, "base64").toString("utf-8"),
      }));
     res.status(200).json({ message: "Filtered by tags", snippets });
     return;
    }

    // If page and limit are provided, handle pagination
    if (page && limit) {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      snippets = await Snippet.find().skip(skip).limit(limitNumber);
      snippets = snippets.map(snippet => ({
        ...snippet.toObject(),
        code: Buffer.from(snippet.code, "base64").toString("utf-8"),
      }));
       res.status(200).json({ message: "Paginated", snippets });
       return;
    }

    // If sorting is provided
    if (sort && order) {
      const sortOptions: any = {};
      sortOptions[sort as string] = order === "asc" ? 1 : -1;
      snippets = await Snippet.find().sort(sortOptions);
      snippets = snippets.map(snippet => ({
        ...snippet.toObject(),
        code: Buffer.from(snippet.code, "base64").toString("utf-8"),
      }));
       res.status(200).json({ message: "Sorted", snippets });
       return;
    }

    // If no filters, pagination, or sorting applied, fetch all snippets
    snippets = await Snippet.find();
    snippets = snippets.map(snippet => ({
      ...snippet.toObject(),
      code: Buffer.from(snippet.code, "base64").toString("utf-8"),
    }));

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

    // Add encoded code (Base64 encoding)
    const encodedCode = Buffer.from(`${code}`).toString("base64");

    // Create a new snippet document
    const snippet = await Snippet.create({
      title,
      code: encodedCode,
      language,
      tags,
      expiresIn,
    });

    // Return the snippet data, optionally decode the base64 if you want to send the original code
    res.status(201).json({
      message: "Snippet added successfully",
      snippet: {
        ...snippet.toObject(),
        code, // Include the original code here if needed in the response
      },
    });
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

    // Decode the encodedCode from base64
    const decodedCode = Buffer.from(snippet.code, "base64").toString("utf-8");

    // Return the snippet along with the decoded code
    res.status(200).json({
      message: "Snippet fetched successfully",
      snippet: {
        ...snippet.toObject(),
        code: decodedCode, // Add decoded code to the response
      },
    });
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

