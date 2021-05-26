import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ButtonCreate({ ...props }) {
  const { t } = useTranslation();
  return (
    <>
      <Link className="btn btn-primary float-right text-white" style={{ width: '130px' }} role="button" to={props.moduleCreate}>
        <i className="fas fa-plus pr-2" />
        {props.label ? props.label : t('app.generics.create')}
      </Link>
    </>
  );
}
