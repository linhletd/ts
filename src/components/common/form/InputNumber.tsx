import React from 'react';
import withController from './withController';

function InputNumber({onChange, isInvalid, label, placeholder, ...rest}) {
  function handleKeyDown(e) {
    if (e.code === 'KeyE') {
      e.preventDefault();
    }
  }
  function handleOnChange(e) {
    let val = e.target.value;
    if (val && !/^[0-9]+$/.test(val)) {
      e.preventDefault();
      return;
    }
    onChange(val);
  }
  function handlePaste(e) {
    let clipboardData = e.clipboardData;
    if (clipboardData.types.indexOf('text/plain') > -1) {
      let text = e.clipboardData.getData('text/plain');
      if (!/^[0-9]+$/.test(text)) {
        e.preventDefault();
      }
    }
  }

  return (
    <>
      {label && <label>{label}</label>}
        <input
          placeholder={placeholder || (label ? label + '...' : undefined)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
          {...rest}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>
  );
}

export default withController(InputNumber)