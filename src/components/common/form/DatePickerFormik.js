import React, { useState, useEffect } from 'react';
import _DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import ErrorBoundary from '../../pages/Fallback/ErrorBoundary';
export default function DatePicker(props) {
  return (
    <ErrorBoundary>
      <__DatePicker {...props} />
    </ErrorBoundary>
  );
}
function __DatePicker(props) {
  let [itvStore] = useState({});
  let {
    field,
    label,
    formik: { setFieldValue, setFieldTouched, values, errors, touched },
    handleChange,
    placeholder,
    disabled,
    direction,
    hasBottomMargin,
    timeOfDay, //'end', 'start'
    showTimeSelect,
    ...rest
  } = props;
  let value = values[field];
  useEffect(() => {
    if (props.autoIncrease) {
      if (!value || value < Date.now()) {
        let itv = 1000;
        clearTimeout(itvStore.itv);
        itvStore.itv = setTimeout(() => {
          handleOnChange(new Date(Date.now()));
        }, itv);
      }
    }
    return () => {
      if (itvStore.itv) {
        clearInterval(itvStore.itv);
      }
    };
  });
  let isInValid = value ? errors[field] : touched[field] && errors[field];
  function handleOnBlur() {
    setFieldTouched(field, true, true);
  }
  function handleOnChange(date) {
    if (!disabled) {
      if (!showTimeSelect && timeOfDay && date) {
        if (timeOfDay === 'start') {
          date = new Date(format(date, 'yyyy/MM/dd'));
        } else {
          date = new Date(new Date(format(date, 'yyyy/MM/dd')).getTime() + 24 * 3600 * 1000 - 1);
        }
      }
      (handleChange || setFieldValue)(field, (date && date.getTime()) || '', true);
    }
  }
  let style = {
    display: 'grid',
    gridTemplateColumns: direction === 'row' ? '1fr 2fr' : '1fr',
    alignItems: 'center',
    columnGap: '5px',
    width: '100%',
    marginBottom: label || hasBottomMargin ? '15px' : '',
  };
  return (
    <div style={style}>
      {label && <label>{label}</label>}
      <_DatePicker
        selected={value}
        dateFormat={showTimeSelect || timeOfDay ? 'dd/MM/yyyy HH:mm:ss' : 'dd/MM/yyyy'}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        showTimeSelect={showTimeSelect}
        disabled={disabled || false}
        placeholderText={placeholder}
        className={isInValid ? 'form-control border border-danger' : 'form-control'}
        {...rest}
      />
      {isInValid && <div style={{ color: '#e62a2a', fontSize: '0.75em', marginTop: '3px', gridArea: direction === 'row' ? '2/2/3/3' : '' }}>{isInValid}</div>}
    </div>
  );
}
