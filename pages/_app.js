import { Provider } from "react-redux";
import Layout from "../components/Layout";
import { wrapper, store } from "../redux/init";
import Head from "next/head";
import "../styles/global.scss";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Head>
          <title>Hashmate</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
