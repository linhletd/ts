import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function ButtonLoading(props) {
  const { loading, children, disabled, customStyle, ...rest } = props;
  const { t } = useTranslation();
  if (customStyle)
    return (
      <>
        <Button disabled={disabled || loading || false} variant="primary" {...rest} style={{ padding: '5px 15px', fontSize: '18px' }}>
          {loading && (
            <>
              <i className="fas fa-spinner fa-pulse" />
              &nbsp;
            </>
          )}
          {children || t('app.generics.save')}
        </Button>
      </>
    );
  else
    return (
      <>
        <Button disabled={disabled || loading || false} variant="primary" {...rest}>
          {loading && (
            <>
              <i className="fas fa-spinner fa-pulse" />
              &nbsp;
            </>
          )}
          {children || t('app.generics.save')}
        </Button>
      </>
    );
}
