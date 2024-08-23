import '../styles/globals.css';
import { Provider } from './Provider';
import Navbar from '@components/layouts/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <Provider>
      <Navbar/>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;