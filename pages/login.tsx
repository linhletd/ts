import Head from 'next/head'
import Layout from 'src/components/common/layout/Layout';
import {useTranslation} from 'react-i18next';
import UserLogin from 'src/components/User/Login/UserLogin';

export default function Login() {
    const {t} = useTranslation()
    return (
        <>
        <Head>
            <title>{t('page.login')}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
            <UserLogin/>
        </Layout>
        </>
    )
}
  