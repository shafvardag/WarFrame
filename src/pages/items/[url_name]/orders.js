import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ItemDetails from '@components/ItemDetails';


function Orders() {
  const router = useRouter();
  const { url_name } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemDetails, setItemDetails] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [remainingItems, setRemainingItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [profit, setProfit] = useState(null);
  const [searchPrice, setSearchPrice] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState('');

  // Helper function to calculate Q1, Q3, and IQR
  const calculateIQR = (data) => {
    const sorted = [...data].sort((a, b) => a.platinum - b.platinum);

    const quartile = (arr, q) => {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;

      if (arr[base + 1] !== undefined) {
        return arr[base].platinum + rest * (arr[base + 1].platinum - arr[base].platinum);
      } else {
        return arr[base].platinum;
      }
    };

    const Q1 = quartile(sorted, 0.25);
    const Q3 = quartile(sorted, 0.75);
    const IQR = Q3 - Q1;

    return { Q1, Q3, IQR };
  };

  // Filter outliers function
  const filterOutliers = (data, Q1, Q3, IQR) => {
    // const lowerBound = Q1 - 1.5 * IQR;
    const upperBound = Q3 + 1.5 * IQR;
    const filtered = data.filter(item => item.platinum <= upperBound);
    const remaining = data.filter(item => item.platinum > upperBound);
    return { filtered, remaining };
  };

  useEffect(() => {
    if (!url_name) return;

    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/items/${url_name}/orders`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const orders = data?.payload?.orders || [];

        // Calculate Q1, Q3, and IQR
        const { Q1, Q3, IQR } = calculateIQR(orders);

        // Filter out outliers
        const { filtered, remaining } = filterOutliers(orders, Q1, Q3, IQR);

        setItemDetails(filtered);
        setFilteredItems(filtered);
        setRemainingItems(remaining);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [url_name]);

  // Filter items based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredItems(itemDetails);
    } else {
      setFilteredItems(itemDetails.filter(item => item.user.status === statusFilter));
    }
  }, [statusFilter, itemDetails]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const calculatePricing = (items) => {
    if (items.length === 0) return { min: null, max: null, avg: null, avg2: null, profit: null };

    const prices = items.map(item => item.platinum);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = (prices.reduce((sum, price) => sum + price, 0) / prices.length).toFixed(2);
    const profitPrice = (avgPrice - minPrice).toFixed(2);

    const frequencyMap = new Map();
    prices.forEach(price => frequencyMap.set(price, (frequencyMap.get(price) || 0) + 1));
    
    let mode = null;
    let maxCount = 0;

    frequencyMap.forEach((count, price) => {
      if (count > maxCount) {
        maxCount = count;
        mode = price;
      }
    });

    return { min, max, avg, mode, modeCount: maxCount, profitPrice };
  };
  useEffect(() => {
    const { min, max, avg, profitPrice } = calculatePricing(filteredItems);
    setMinPrice(min);
    setMaxPrice(max);
    setAvgPrice(avg);
    setProfit(profitPrice);
  }, [filteredItems]);

  // Function to handle price search
  const handleSearchPriceChange = (e) => {
    const price = e.target.value;
    setSearchPrice(price);
    const priceValue = parseFloat(price);
  
    if (price !== '') {
      const matchedItems = itemDetails.filter(item => item.platinum === priceValue);
      setFilteredItems(matchedItems);
    } else {
      setFilteredItems(itemDetails); // Reset to show all items if input is cleared
    }
  };


  // Function to calculate min, avg, max for a given rank
  const calculateStatsForRank = (rank) => {
    const itemsWithRank = itemDetails.filter(item => item.mod_rank === rank);
    const prices = itemsWithRank.map(item => item.platinum);
  
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((acc, curr) => acc + curr, 0) / prices.length;
    const profit = avgPrice - minPrice;
  
    return {
      minPrice: prices.length > 0 ? minPrice : null,
      avgPrice: prices.length > 0 ? avgPrice.toFixed(2) : null,
      maxPrice: prices.length > 0 ? maxPrice : null,
      profit: prices.length > 0 ? profit.toFixed(2) : null,
    };
  };
  
  // Calculate stats for ranks 0 and 5
  const rank0Stats = calculateStatsForRank(0);
  const rank3Stats = calculateStatsForRank(3);
  const rank5Stats = calculateStatsForRank(5);  


  const handleCopyClick = (itemDetail) => {
    const message = `/w ${itemDetail.user.ingame_name} Hi! I want to buy: "${url_name}" for ${itemDetail.platinum}. (Snow Dream Studios)`;
    setPopupText(message);
    setShowPopup(true);
    navigator.clipboard.writeText(message);
    setTimeout(() => setShowPopup(false), 3000);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='p-10'>
    <ItemDetails itemName={url_name} />
    <div className='flex justify-between items-center my-6'>
      <div className='mb-4'>
        <h1>Filter: </h1>
        <button onClick={() => handleFilterChange('all')} className='px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded' > All </button>
        <button onClick={() => handleFilterChange('offline')} className='px-4 py-2 mr-2 bg-red-600 text-white rounded' > Offline </button>
        <button onClick={() => handleFilterChange('online')} className='px-4 py-2 mr-2 bg-green-400 text-gray-800 rounded' > Online </button>
        <button onClick={() => handleFilterChange('ingame')} className='px-4 py-2 bg-green-600 text-white rounded' > In Game </button>
        <input className='w-48 px-3 py-2 bg-gray-200 border border-gray-600 text-sm text-black placeholder:text-black rounded mx-2' min={0} value={searchPrice} onChange={handleSearchPriceChange} type='number' placeholder='Search By Price'/>
      </div>
      <div className='flex flex-col items-end'>
        {itemDetails.some(item => item.mod_rank) && (
          <>
          {itemDetails.some(item => item.mod_rank === 0) && (
            <div className='flex space-x-10 bg-red-100 px-4 my-1'>
              <h2 className='text-xl'>0 Rank Based --&gt; </h2>
              <h3 className='text-lg text-green-500'><span className='font-bold text-black'>Min Price:</span> {rank0Stats.minPrice !== null ? rank0Stats.minPrice : 'N/A'}</h3>
              <h3 className='text-lg text-gray-700'><span className='font-bold text-black'>Avg Price:</span> {rank0Stats.avgPrice !== null ? rank0Stats.avgPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Max Price:</span> {rank0Stats.maxPrice !== null ? rank0Stats.maxPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Profit for buying at minimum price:</span> {rank0Stats.profit !== null ? rank0Stats.profit : 'N/A'}</h3>
            </div>
          )}
          {itemDetails.some(item => item.mod_rank === 5) ? (
            <div className='flex space-x-10 bg-green-100 px-4 my-1'>
              <h2 className='text-xl'>5 Rank Based --&gt; </h2>
              <h3 className='text-lg text-green-500'><span className='font-bold text-black'>Min Price:</span> {rank5Stats.minPrice !== null ? rank5Stats.minPrice : 'N/A'}</h3>
              <h3 className='text-lg text-gray-700'><span className='font-bold text-black'>Avg Price:</span> {rank5Stats.avgPrice !== null ? rank5Stats.avgPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Max Price:</span> {rank5Stats.maxPrice !== null ? rank5Stats.maxPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Profit for buying at minimum price:</span> {rank5Stats.profit !== null ? rank5Stats.profit : 'N/A'}</h3>
            </div>
        ) : (
          itemDetails.some(item => item.mod_rank === 3) && (
            <div className='flex space-x-10 bg-green-100 px-4 my-1'>
              <h2 className='text-xl'>3 Rank Based --&gt; </h2>
              <h3 className='text-lg text-green-500'><span className='font-bold text-black'>Min Price:</span> {rank3Stats.minPrice !== null ? rank3Stats.minPrice : 'N/A'}</h3>
              <h3 className='text-lg text-gray-700'><span className='font-bold text-black'>Avg Price:</span> {rank3Stats.avgPrice !== null ? rank3Stats.avgPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Max Price:</span> {rank3Stats.maxPrice !== null ? rank3Stats.maxPrice : 'N/A'}</h3>
              <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Profit for buying at minimum price:</span> {rank3Stats.profit !== null ? rank3Stats.profit : 'N/A'}</h3>
            </div>
          )
        )}
          </>
        )}
        <div className='flex space-x-10 bg-blue-100 px-4 my-1'>
          <h2 className='text-xl'>Overall --&gt; </h2>
          <h3 className='text-lg text-green-500'><span className='font-bold text-black'>Min Price:</span> {minPrice !== null ? minPrice : 'N/A'}</h3>
          <h3 className='text-lg text-gray-700'><span className='font-bold text-black'>Avg Price:</span> {avgPrice !== null ? avgPrice : 'N/A'}</h3>
          <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Max Price:</span> {maxPrice !== null ? maxPrice : 'N/A'}</h3>
          <h3 className='text-lg text-red-500'><span className='font-bold text-black'>Profit for buying at minimum price:</span> {profit !== null ? profit : 'N/A'}</h3>
        </div>
      </div>
    </div>
    <div className='mb-10 relative p-5 w-fit'>
      <div className=' backdrop-blur-sm w-full h-full absolute flex justify-center items-center font-bold text-xl'>Threshold Under working ...</div>
      <h1 className='text-2xl'>Set Threshold:</h1>
      <input type="text" className='w-72 px-3 py-2 bg-gray-200 border border-gray-600 text-sm text-black placeholder:text-black rounded mx-2' placeholder='Set your desired price ...' />
      <button className='px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded'>Set</button>
    </div>

    {filteredItems.length > 0 ? (
    <table className='min-w-full divide-y divide-gray-200'>
      <thead className='bg-gray-50'>
        <tr>
          <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
          <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
          <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Reputation</th>
          <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Unit Price</th>
          {itemDetails.some(item => item.mod_rank) && (
            <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
          )}
          <th className='px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantity</th>
          <th className='pl-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Copy the Msg for in-game</th>
          <th className='pl-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Add to Fav</th>
        </tr>
      </thead>
          <>
            <tbody className='bg-white divide-y divide-gray-200'>
            {filteredItems .sort((a, b) => a.platinum - b.platinum) .map((itemDetail) => (
                <tr key={itemDetail.id}>
                  <td className={`px-6 whitespace-nowrap text-sm font-medium ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>{itemDetail.user.ingame_name}</td>
                  <td className={`px-6 whitespace-nowrap text-sm ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''} ${itemDetail.user.status === 'offline' ? 'text-red-600' : 'text-green-600'}`}>{itemDetail.user.status}</td>
                  <td className={`px-6 whitespace-nowrap text-center text-sm ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>{itemDetail.user.reputation}</td>
                  <td className={`px-6 whitespace-nowrap text-center text-sm ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>{itemDetail.platinum}</td>
                  {itemDetails.some(item => item.mod_rank) && (
                    <td className={`px-6 whitespace-nowrap text-center text-sm ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>{itemDetail.mod_rank} of 5</td>
                  )}
                  <td className={`px-6 whitespace-nowrap text-center text-sm ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>{itemDetail.quantity}</td>
                  <td onClick={() => handleCopyClick(itemDetail)} className={`pl-6 whitespace-nowrap text-sm cursor-pointer hover:underline text-center ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>Copy Msg</td>
                  <td className={`pl-6 whitespace-nowrap text-sm cursor-pointer hover:underline text-center ${itemDetail.mod_rank === 5 ? 'bg-green-50' : ''}`}>Add</td>
                </tr>
              ))}
            </tbody>
          </>
    </table>
        ) : 
          <>
            <p className='text-xl text-center'>No Item Found</p>
          </>
        }

    <h2 className='text-xl font-bold mt-10 mb-4'>Remaining Items</h2>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Reputation</th>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unit Price</th>
          <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
            <th className='px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantity</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {remainingItems
            .sort((a, b) => a.platinum - b.platinum)
            .map((itemDetail) => (
              <tr key={itemDetail.id}>
                <td className='px-6 whitespace-nowrap text-sm font-medium text-gray-900'>{itemDetail.user.ingame_name}</td>
                <td className={`px-6 whitespace-nowrap text-sm ${itemDetail.user.status === 'offline' ? 'text-red-600' : 'text-green-600'}`}>{itemDetail.user.status}</td>
                <td className='px-6 whitespace-nowrap text-sm text-gray-500'>{itemDetail.user.reputation}</td>
                <td className='px-6 whitespace-nowrap text-sm text-gray-500'>{itemDetail.platinum}</td>
                <td className='px-6 whitespace-nowrap text-sm text-gray-500'>{itemDetail.mod_rank} of 5</td>
                <td className='px-6 whitespace-nowrap text-sm text-gray-500'>{itemDetail.quantity}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {showPopup && (
      <div className='fixed top-20 left-1/2 -translate-x-1/2 p-3 bg-green-100 border border-green-600 shadow-lg rounded'>
        <h1>Copied !</h1>
        <p className='text-sm'>{popupText}</p>
      </div>
    )}
  </div>
  );
}

export default Orders;