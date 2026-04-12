import mongoose , {Schema} from "mongoose";

const contentSchema = new Schema(
    {
        genre:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
            required: true
        },
        title:{
            type: String,
            required: true
        },
        content :{
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Content = mongoose.model("Content",contentSchema)