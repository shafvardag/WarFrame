// models/Favorite.js
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: String, required: true }, 
  itemName: { type: String, required: true }, 
  itemDetails: { type: Object, required: true }, 
}, { timestamps: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
