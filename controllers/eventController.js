import Event from "../models/eventModel.js";
import User from "../models/userModel.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'fullName email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createNewEvent = async (req, res) => {
  const { title, description, location, date, time, tags, type } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      location,
      organizer: req.user.id,
      date,
      time,
      tags,
      type,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const registerUserForEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
  
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      if (!event.registeredUsers.includes(userId)) {
        event.registeredUsers.push(userId);
        await event.save();
      }
  
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const addCommentToEvent = async (req, res) => {
    const { eventId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
  
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const comment = {
        user: userId,
        text,
      };
  
      event.comments.push(comment);
      await event.save();
  
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, location, date, time, tags, type } = req.body;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You can only edit your own events' });
    }

    event.title = title;
    event.description = description;
    event.location = location;
    event.date = date;
    event.time = time;
    event.tags = tags;
    event.type = type;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You can only delete your own events' });
    }

    await event.remove();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}