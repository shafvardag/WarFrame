import MongoDb from "@/lib/mongodb.js";
import Favorite from '@/models/Favorite';

export default async function handler(req, res) {
    const { userId } = req.query;
  
    if (req.method === 'GET') {
      try {
        await MongoDb();
  
        const favorites = await Favorite.find({ userId });
  
        res.status(200).json(favorites);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }