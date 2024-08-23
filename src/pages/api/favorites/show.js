import MongoDb from "@/lib/mongodb.js";
import Favorite from '@/models/Favorite';

export default async function handler(req, res) {
    await MongoDb();
  
    if (req.method === 'GET') {
      try {
        const { userId } = req.query;
        const favorites = await Favorite.find({ 'itemDetail.user.id': userId }).populate('itemDetail');
        res.status(200).json(favorites);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching favorites' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }