import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const index = () => {
  const { data: session } = useSession();
  const [allOrders, setAllOrders] = useState([]);
  const [urlName, setUrlName] = useState([]);
  return (
    <div>index</div>
  )
}

export default index