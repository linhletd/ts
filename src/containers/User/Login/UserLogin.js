import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { callLogin } from 'src/util/request';
import { useRouter } from 'next/router'

import UserLoginForm from './UserLoginForm';
import Alert from 'src/components/common/modal/Alert';
import { isLoggedIn, login, storePermission, storeInfo } from 'src/util/TokenProvider';
import APIProvider from 'src/util/api/url/APIProvider';
import BrowserProvider from 'src/util/browser/BrowserProvider';

export default function UserLogin() {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ content: '', show: false });
  const router = useRouter();
  useEffect(()=>{
    if(isLoggedIn()){
      router.replace(BrowserProvider.getUrl('DEAL_LIST'))
    }
  },[])

  const handleClose = () => setAlert({ show: false });
  const onSubmitEditForm = async (values) => {
    const { data, code } = await callLogin(APIProvider.getUrl('LOGIN', null), values);
    console.debug(`UserLogin - data: ${JSON.stringify(data)}`);
    if (code === 200) {
      login(data.token);
      console.info('UserLogin - logged in success redirect to home page');
      storePermission(data.permissions);
      storeInfo({
        username: data.username,
        avatar: data.avatar,
      });
      router.replace(BrowserProvider.getUrl('DEAL_LIST'))
    } else {
      setAlert({ content: <p className="text-danger">{data.message}</p>, show: true });
    }
  };

  return (
    <>
      <UserLoginForm onSubmitHandler={onSubmitEditForm} />
      <Alert handleClose={handleClose} title={t('page.login.dialog.warning')} {...alert} />
    </>
  );
}
