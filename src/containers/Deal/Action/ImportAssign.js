import React from 'react';
import ComponentValidator from '../../../auth/components/Validator';
import UploadFile from '../../Common/UploadFile';
import { useTranslation } from 'react-i18next';

const ImportAssign = (props) => {
  const { t } = useTranslation();
  return (
    <ComponentValidator allowedAuthorities={['canListAllDeal']} authorityKey="permissions">
      <UploadFile keyApi="DEAL_IMPORT_ASSIGN" title={t('page.deal.upload.assign')} {...props} />
    </ComponentValidator>
  );
};

export default ImportAssign;
