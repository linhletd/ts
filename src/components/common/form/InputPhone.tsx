import React from 'react';
import withController from './withController';

function InputPhone({errors, label, placeholder, onChange, ...rest}) {
  const isInvalid = errors[rest.name]?.message;
  function handleChange(e){
    let val = e.target.value;
    val = val.replace(/\s+/g, '').replace(/^(0+)/, '');
    if (val) {
      if ((val.startswith('2') && !/^2[0-9]{0,9}$/.test(val)) || (!val.startswith('2') && !/^[1-9]{1}[0-9]{0,8}$/.test(val))) {
        e.preventDefault();
        return;
      }
    }
    onChange(val);
  }
    return (
      <>
        {label && <label>{label}</label>}
        <input
          placeholder={placeholder || (label ? label + '...' : undefined)}
          onChange={handleChange}
          className='form-control'
          {...rest}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
      </>
    );
}
 export default withController(InputPhone)