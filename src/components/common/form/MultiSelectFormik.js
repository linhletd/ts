import React from 'react';
import MultiSelect from 'react-multi-select-component';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../../pages/Fallback/ErrorBoundary';

export default function MultiSelectFormik(props) {
  return (
    <ErrorBoundary>
      <_MultiSelectFormik {...props} />
    </ErrorBoundary>
  );
}
const _MultiSelectFormik = (props) => {
  const { t } = useTranslation();
  const { options, formik, field, label, overrideStrings } = props;
  const value = formik.values[field];

  Object.assign(overrideStrings, {
    allItemsAreSelected: t('components.multiSelect.allSelected'),
    selectAll: t('components.multiSelect.selectAll'),
    search: t('components.multiSelect.search'),
  });
  const handleChangeValue = (values) => {
    formik.setFieldValue(field, values);
  };
  const customValueRenderer = (selected) => {
    if (selected.length >= 2 && selected.length < options.length) {
      return `${selected.length} mục được chọn`;
    }
  };

  return (
    <div>
      {label && <label htmlFor={field}>{label}</label>}
      <MultiSelect options={options} value={value} onChange={handleChangeValue} labelledBy={'Select'} valueRenderer={customValueRenderer} overrideStrings={overrideStrings} />
    </div>
  );
};
