import React from 'react';
import _DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import withController from './withController';

function DatePicker({field, label, onChange,  placeholder, disabled, timeOfDay, value, isInvalid, ...rest}) {
  function handleOnChange(date) {
    if (!rest.disabled) {
      if (!rest.showTimeSelect && timeOfDay && date) {
        if (timeOfDay === 'start') {
          date = new Date(format(date, 'yyyy/MM/dd'));
        } else {
          date = new Date(new Date(format(date, 'yyyy/MM/dd')).getTime() + 24 * 3600 * 1000 - 1);
        }
      }
      onChange(date && date.getTime() || '');
    }
  }
  return (
    <>
      {label && <label>{label}</label>}
      <_DatePicker
        selected={value}
        dateFormat={rest.showTimeSelect || timeOfDay ? 'dd/MM/yyyy HH:mm:ss' : 'dd/MM/yyyy'}
        onChange={handleOnChange}
        disabled={disabled || false}
        placeholderText={placeholder || (label ? label + '...' : undefined)}
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>
  );
}

export default withController(DatePicker)