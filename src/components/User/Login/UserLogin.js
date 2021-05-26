import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import { Helmet } from 'react-helmet';
import { callLogin } from '../../../hooks/useRequest';

import UserLoginForm from './UserLoginForm';
import CenteredContent from '../../../components/Layout/CenteredContent';
import Alert from '../../../components/Modal/Alert';
import { isLoggedIn, login, storePermission, storeInfo } from '../../../util/TokenProvider';
import APIProvider from '../../../util/api/url/APIProvider';
import BrowserProvider from '../../../util/browser/BrowserProvider';

export default function UserLogin() {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ content: '', show: false });
  if (isLoggedIn()) {
    console.info('UserLogin - already logged in, redirect to home page');
    return <Redirect to={BrowserProvider.getUrl('DASHBOARD')} />;
  }

  const handleClose = () => setAlert({ show: false });
  const onSubmitEditForm = async (values, actions) => {
    actions.setSubmitting(true);
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
      window.location.reload();
    } else {
      if (code === 400) {
        actions.resetForm(true);
      }
      setAlert({ content: <p className="text-danger">{data.message}</p>, show: true });
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet title={t('page.login')} />
      <CenteredContent>
        <UserLoginForm onSubmitHandler={onSubmitEditForm} />
        <Alert handleClose={handleClose} title={t('page.login.dialog.warning')} {...alert} />
      </CenteredContent>
    </>
  );
}
