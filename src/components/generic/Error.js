import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Fallback from './Fallback';

const Error = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t('helmet.title.error')} />
      <Fallback image={'/images/error.png'} altImage={t('page.error.alt')} text={props.isPageLevel ? t('page.error.text') : t('page.content.error.text')} {...props} />
    </>
  );
};

export default Error;
