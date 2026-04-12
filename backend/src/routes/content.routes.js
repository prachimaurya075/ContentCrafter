import express from "express"; // Importing Router from express
import { getContent , getContentById } from '../controllers/content.controller.js'; // Importing getContent function from content.controller 
import { getGenres } from '../controllers/genre.controller.js';
import { generateChatContent} from '../controllers/ai.controller.js';

const router = express.Router();

router.get("/genres", getGenres);  // GET route for genres
router.get("/detail/:contentId", getContentById); // get route for specific content - MUST be before /:genreId
router.get("/:genreId", getContent);  // get route for genre content

router.post('/generate/chat', generateChatContent);
  


export default router;
