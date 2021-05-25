import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ErrorBoundary from '../../pages/Fallback/ErrorBoundary';

export default function Alert({ title, show, handleClose, size, backdrop, headless, content, feetless, footerContent, buttonList }) {
  console.debug(`Alert - show: ${show}`);
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={handleClose} size={size} backdrop={backdrop}>
      <ErrorBoundary>
        {!headless && (
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        )}

        <Modal.Body>{content}</Modal.Body>
        {!feetless && (
          <Modal.Footer>
            {footerContent ? (
              footerContent
            ) : buttonList ? (
              buttonList
            ) : (
              <Button variant="secondary" onClick={handleClose}>
                {t('app.generics.close')}
              </Button>
            )}
          </Modal.Footer>
        )}
      </ErrorBoundary>
    </Modal>
  );
}
