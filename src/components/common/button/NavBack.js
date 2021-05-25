import React from 'react';
import { useHistory } from 'react-router-dom';
import {useTranslation} from 'react-i18next'

export default function NavBack() {
  const {t} = useTranslation();
  const history = useHistory();

  return (
    <a className="btn btn-secondary" href="#" role="button" onClick={(e) => {
      e.preventDefault();
      history.goBack()
    }}>
      {t('components.navback.text.back')}
    </a>
  );
}
