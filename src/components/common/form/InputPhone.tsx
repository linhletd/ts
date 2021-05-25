import React from 'react';
import WithController from './WithController';

function InputPhone({isInvalid, label, placeholder, onChange, ...rest}) {
  function handleChange(e){
    let val = e.target.value;
    val = val.replace(/\s+/g, '').replace(/^(0+)/, '');
    if (val) {
      if ((val.startsWith('2') && !/^2[0-9]{0,9}$/.test(val)) || (!val.startsWith('2') && !/^[1-9]{1}[0-9]{0,8}$/.test(val))) {
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
          {...rest}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
      </>
    );
}
 export default WithController(InputPhone)