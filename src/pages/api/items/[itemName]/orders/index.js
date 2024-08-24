// pages/api/items/[itemName]/orders.js
import axios from 'axios';

export default async function handler(req, res) {
  const { itemName } = req.query;
  const itemNameLowerCase = itemName.toLowerCase();
  
  if (req.method === 'GET') {
    try {
      const response = await axios.get(`https://api.warframe.market/v1/items/${itemNameLowerCase}/orders`);
      const orders = response.data.payload.orders;

      // Filter orders by type "sell"
      const sellOrders = orders.filter(order => order.order_type === 'sell');

      // Respond with the filtered orders
      res.status(200).json({ ...response.data, payload: { orders: sellOrders } });
    } catch (error) {
      console.error('Error fetching item details:', error);
      res.status(500).send('Error fetching item details');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
