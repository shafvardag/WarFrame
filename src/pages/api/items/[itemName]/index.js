import axios from 'axios';

// API route handler for /api/items/[url_name]
export default async function handler(req, res) {
  const { itemName } = req.query;

  console.log('Received url_name:', itemName); 

  if (!itemName) {
    return res.status(400).json({ error: 'Missing url_name parameter' });
  }

  const apiUrl = `https://api.warframe.market/v1/items/${itemName}`;

  try {
    // Fetch data from the external API
    const response = await axios.get(apiUrl);

    console.log('Response from external API:', response.data);

    // Respond with the data from the external API
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors and respond with an error message
    console.error('Error fetching item details:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}
