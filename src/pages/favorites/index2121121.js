import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Favorites() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (session) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/favorites/${session.user.id}`);
          const data = await response.json();
          setFavorites(data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };
      fetchFavorites();
    }
  }, [session]);
  

  if (!session) {
    return <p>You need to be logged in to view your favorites.</p>;
  }

  return (
    <div>
      <h1>My Favorites</h1>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
            <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Reputation</th>
            <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Price</th>
            {favorites.some(item => item.itemDetails.mod_rank) && (
              <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
            )}
            <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantity</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {favorites.map((fav) => (
            <tr key={fav.id}>
              <td className='px-6 whitespace-nowrap text-sm font-medium'>{fav.itemName}</td>
              <td className='px-6 whitespace-nowrap text-sm font-medium'>{fav.itemDetails.user.ingame_name}</td>
              <td className='px-6 whitespace-nowrap text-sm'>
                {fav.itemDetails.user.status === 'offline' ? 'Offline' : 'Online'}
              </td>
              <td className='px-6 whitespace-nowrap text-center text-sm'>{fav.itemDetails.user.reputation}</td>
              <td className='px-6 whitespace-nowrap text-center text-sm'>{fav.itemDetails.platinum}</td>
              {favorites.some(item => item.itemDetails.mod_rank) && (
                <td className='px-6 whitespace-nowrap text-center text-sm'>{fav.itemDetails.mod_rank}</td>
              )}
              <td className='px-6 whitespace-nowrap text-center text-sm'>{fav.itemDetails.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
