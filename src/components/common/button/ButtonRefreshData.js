import React, { useState } from 'react';
import Alert from '../../components/Modal/Alert';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ButtonReloadData = ({ handleReload }) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ show: false });
  const handleClick = () => {
    let pendingResult = handleReload();
    if (pendingResult && pendingResult.then) {
      pendingResult.then(() => {
        setAlert({
          show: true,
          content: t('app.genericts.refresh.data'),
          title: t('app.genericts.notify'),
          handleClose() {
            setAlert({ show: false });
          },
        });
      });
    }
  };
  return (
    <>
      <Button onClick={handleClick}>{t('app.generics.button.refresh')}</Button>
      <Alert {...alert} />
    </>
  );
};

export default ButtonReloadData;
