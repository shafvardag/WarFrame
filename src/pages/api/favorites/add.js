// pages/api/favorites/add.js
import mongoose from 'mongoose';
import Favorite from '@/models/Favorite';
import MongoDb from "@/lib/mongodb.js";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, itemId, itemName, itemDetail } = req.body;
    try {
      await MongoDb();// Ensure MongoDB is connected
      // Check if the user exists (implement these checks as needed)
      const user = await mongoose.model('User').findById(userId); // Use Mongoose model to find user
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const favorite = new Favorite({
        userId,
        itemId,
        itemName,
        itemDetails: itemDetail,
      });

      await favorite.save();

      res.status(200).json({ message: 'Item added to favorites' });
    } catch (error) {
      console.error('Error adding to favorites:', error); // Log the error for debugging
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
