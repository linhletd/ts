import '../styles/globals.css';
import 'src/util/i18n';
import type { AppProps } from 'next/app';
import Layout from 'src/components/common/layout/Layout';
import {useRouter} from 'next/router';
import BrowserProvider from 'src/util/browser/BrowserProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  if(router.asPath === BrowserProvider.getUrl('LOGIN')){
    return <Component {...pageProps} />
  }
  return <Layout><Component {...pageProps} /></Layout>
}
export default MyApp
