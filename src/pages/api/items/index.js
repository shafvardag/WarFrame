import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.get('https://api.warframe.market/v1/items');
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).send('Error fetching items');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
