import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Helmet } from 'react-helmet';

import DealEditForm from './DealEditForm';
import CenteredContent from '../../../components/Layout/CenteredContent';
import Alert from '../../../components/Modal/Alert';
import { callPost } from '../../../hooks/useRequest';
import APIProvider from '../../../util/api/url/APIProvider';

export default function DealCreate() {
  const { t } = useTranslation();
  const [{ message, show }, setMessage] = useState({ message: '', show: false });
  let [resetSubcriberStore] = useState({});

  const handleClose = () => setMessage({ message: '', show: false });
  const onSubmitEditForm = async (values, actions) => {
    console.log(`DealCreate - values: ${JSON.stringify(values)}`);
    actions.setSubmitting(true);
    // let idNestedField = ['contact', 'campaign', 'district', 'province', 'owner', 'dealPackage', 'stage'];
    let idNestedField = ['campaign', 'district', 'province', 'owner'];
    let vals = {};
    Object.keys(values).map((cur) => {
      !/^\s*$/.test(values[cur]) && (vals[cur] = values[cur]);
    });
    idNestedField.map((cur) => {
      (vals[cur] && (vals[cur] = { id: vals[cur] })) || (vals[cur] = null);
    });
    console.log(JSON.stringify(vals));
    const { code, data } = await callPost(APIProvider.getUrl('DEAL_CREATE_ALT'), vals);
    console.debug(`DealCreate - code: ${JSON.stringify(code)}`);
    if (code === 200) {
      actions.resetForm(true);
      manualResetFields();
      actions.setSubmitting(false);
      return setMessage({ message: t('page.deal.create.dialog.text'), show: true });
    }
    function manualResetFields() {
      Object.keys(resetSubcriberStore).map((cur) => {
        resetSubcriberStore[cur]();
      });
    }
    setMessage({
      message: (
        <>
          {t('page.deal.create.dialog.error.text')}
          <p style={{ color: 'red' }}>{data.message}</p>
        </>
      ),
      show: true,
    });
  };

  return (
    <>
      <Helmet title={t('helmet.title.deal.create')} />
      <CenteredContent>
        <h1>{t('page.deal.create.text.form')}</h1>
        <DealEditForm onSubmitHandler={onSubmitEditForm} resetSubcriberStore={resetSubcriberStore} />
        <Alert show={show} handleClose={handleClose} title={t('page.deal.dialog.warning')} content={message} />
      </CenteredContent>
    </>
  );
}
