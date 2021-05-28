import React from 'react';
import _DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import withController from './withController';

const style = {
  display: 'grid',
  gridTemplateColumns: '1fr',
};

function DatePicker({errors, label, onChange,  placeholder, disabled, timeOfDay, value, ...rest}) {
  const isInvalid = errors[rest.name]?.message;
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
    <div style={style}>
      {label && <label>{label}</label>}
      <_DatePicker
        selected={value}
        dateFormat={rest.showTimeSelect || timeOfDay ? 'dd/MM/yyyy HH:mm:ss' : 'dd/MM/yyyy'}
        onChange={handleOnChange}
        disabled={disabled || false}
        placeholderText={placeholder || (label ? label + '...' : undefined)}
        className='form-control'
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </div>
  );
}

export default withController(DatePicker)