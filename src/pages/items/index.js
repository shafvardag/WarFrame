import { useState, useEffect } from 'react';
import Link from 'next/link';

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data.payload.items);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-10">
      <h1>Warframe Market Items</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL Name</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id}>
              <td className="px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link href={`/items/${item.url_name}/orders`}>
                  <p className="text-blue-600 hover:underline">{item.item_name}</p>
                </Link>
              </td>
              <td className="px-6 whitespace-nowrap text-sm text-gray-500">{item.url_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Items;
