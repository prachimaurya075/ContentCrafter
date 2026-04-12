import {Content} from "../models/content.model.js";
import {Genre} from "../models/genre.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

//Get content list by genre(with preview)
const getContent = async (req, res)=>{
    try {
        const {genreId}= req.params;
        console.log('Fetching content for genreId:', genreId);
        
        //Find all content for this genre
        const contents = await Content.find({ genre: genreId });
        console.log('Found contents:', contents.length);
        
        if(contents.length === 0){
            // Debug: Check if genre exists
            const genre = await Genre.findById(genreId);
            console.log('✅ Genre found:', genre?.name || 'NOT FOUND');
            
            // Check all content in database
            const allContent = await Content.find().populate('genre');
            console.log('📊 Total content in DB:', allContent.length);
            if(allContent.length > 0) {
                console.log('📋 Sample content:', allContent.slice(0, 2).map(c => ({ 
                    genre_id: c.genre?._id, 
                    genre_name: c.genre?.name, 
                    title: c.title 
                })));
            }
            
            return res.status(404)
            .json(new ApiError(404 , "No content found for this genre"))
        }

        //Create preview version of content
      const contentPreviews= contents.map(content=>{
        const preview ={
            _id: content._id,
            title: content.title,
            //create a short preview(first 100 charc)
            preview: content.content.substring(0,100)+(content.content.length >100 ?'...':'')
        };
        return preview;
      })

        return res.status(200)
        .json(new ApiResponse(200, contentPreviews))
        
    } catch (error) {
        console.error('Error fetching content:', error);
        return res.status(500).
        json(new ApiError(500 , "No content found for this genre"))    
    }
}
//Get full content by id 
const getContentById = async (req,res)=>{
    try {
        const {contentId}= req.params;
        //Find content by id
        const content = await Content.findById(contentId);
        if(!content){
            return res.status(404)
            .json(new ApiError(404 , "No content found for this genre"))
        }
        return res.status(200).json(new ApiResponse(200, content))
        
    } catch (error) {
        console.log(error);
        return res.status(500).
        json(new ApiError(500 , "No content found for this genre"))
        
    }
}

export  {getContent,getContentById}