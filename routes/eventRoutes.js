import express from "express";
import {
  organizerMiddleware,
  authMiddleware,
} from "../middleware/authMiddleware.js";
import { registerUserForEvent,addCommentToEvent,editEvent,getEvents,createNewEvent,deleteEvent } from "../controllers/eventController.js";

const router = express.Router();

// Get all events - Accessible by both Normal Users and Organizers
router.get('/events', authMiddleware, getEvents);

// Create a new event - Accessible only by Organizers
router.post('/events', authMiddleware, organizerMiddleware, createNewEvent);

//Registering for an event - Accessible to all users
router.post('/events/:eventId/register', authMiddleware, registerUserForEvent);

//Commenting on an event - Accessible to all users
router.post('/events/:eventId/comments', authMiddleware, addCommentToEvent);

// Edit an event - Accessible only by the Organizer who created it
router.put('/events/:id', authMiddleware, organizerMiddleware, editEvent );

// Delete an event - Accessible only by the Organizer who created it
router.delete('/events/:id', authMiddleware, organizerMiddleware, deleteEvent);

export default router;