import React from 'react';

export default function Input({isInvalid, label, placeholder, ...rest}) {
    return (
      <>
        {label && <label>{label}</label>}
        <input
          placeholder={placeholder || (label ? label + '...' : undefined)}
          {...rest}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
      </>
    );
}
