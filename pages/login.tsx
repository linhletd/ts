import Head from 'next/head'
import {useTranslation} from 'react-i18next';
import UserLogin from 'src/containers/User/Login/UserLogin';

export default function Login() {
    const {t} = useTranslation()
  return (
        <>
        <Head>
            <title>{t('page.login')}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className=" row justify-content-center align-items-center" style={{ height: '80vh' }}>
            <div className={`col-lg-4 col-md-6 col-sm-9 shadow-sm`}><UserLogin/></div>
        </div>
        </>
    )
}