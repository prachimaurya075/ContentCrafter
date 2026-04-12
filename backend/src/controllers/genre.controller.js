import {Genre} from "../models/genre.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const getGenres = async (req , res)=>{
    try {
        const genres = await Genre.find();
        if(genres.length === 0){
            return res.status(404)
            .json(
                new ApiError(404 , "No genres found")
            )
        }
        return res.status(200)
        .json(
            new ApiResponse(200 , genres)
        )
        
    } catch (error) {
        console.log(error)
        res.status(500)
        .json(
            new ApiError(500 , "Internal server error")
        )
        
    }
}

export {getGenres}