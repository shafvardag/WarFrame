import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const ItemDetails = () => {
  const router = useRouter();
  const { url_name } = router.query; // Use url_name to match API query

  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url_name) return;

    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/items/${url_name}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItemDetails(data?.payload?.item || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [url_name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!itemDetails) return <p>No item details found.</p>;

  // Find the `en` object within the items_in_set array
  const itemEn = itemDetails.items_in_set[0]?.en || {};

  // Extract the `en` properties with fallbacks
  const itemNameEN = itemEn.item_name || 'No Name';
  const description = itemEn.description || 'No Description';
  const wikiLink = itemEn.wiki_link || '#';
  const thumb = itemEn.thumb || '';
  const icon = itemEn.icon || '';

  return (
    <div>
      <h1 className='text-4xl uppercase font-semibold mb-5'>{itemNameEN}</h1>
      <div className='flex items-center'>
        <div className='rounded-full border-2 border-[#265663] hover:border-[#399ea5] transition-all ease-in-out duration-200 w-[150px] h-[150px] p-6'>
          <img
            src={`https://warframe.market/static/assets/${thumb}`}
            alt={itemNameEN}
            className='w-full h-full object-contain object-center'
          />
        </div>
        <div className='ml-4'>
          <p>Item Name: {itemNameEN}</p>
          <p>Description: {description}</p>
          <p>
            Wiki Link:{' '}
            <a href={wikiLink} target="_blank" rel="noopener noreferrer">
              {wikiLink !== '#' ? 'View Wiki' : 'No Wiki Link'}
            </a>
          </p>
          <p>
            Tags:{' '}
            {itemDetails.items_in_set[0]?.tags ? itemDetails.items_in_set[0]?.tags.join(', ') : 'No Tags'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
