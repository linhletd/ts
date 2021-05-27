import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function ModalAccountTrial(props) {
  const { t } = useTranslation();

  const handleHideModal = () => {
    props.setAlert({
      show: false,
    });
  };

  return (
    <div className="col">
      <div>{t('page.contact.modal.accountTrial.text.1')} X data</div>
      <div>
        {t('page.contact.modal.accountTrial.text.2')} Y data {t('page.contact.modal.accountTrial.text.3')}
      </div>
      <div>{t('page.contact.modal.accountTrial.text.4')}</div>
      <div>{t('page.contact.modal.accountTrial.text.5')} 123456</div>
      <div>{t('page.contact.modal.accountTrial.text.6')} 123456</div>
      <div className="row justify-content-end mt-3">
        <Button variant="secondary" onClick={handleHideModal} className="mr-2">
          {t('page.contact.modal.accountTrial.close')}
        </Button>
        <Button variant="primary" onClick={() => {}}>
          {t('page.contact.modal.accountTrial.submit')}
        </Button>
      </div>
    </div>
  );
}
