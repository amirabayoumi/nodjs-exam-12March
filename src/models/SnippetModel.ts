import mongoose from "mongoose";


const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    expiresIn: {
        type: Number,
    } 
    , 
    createdAt: {
        type: Date, 
        default: Date.now
    }

})

export const Snippet = mongoose.model("Snippet", snippetSchema);

