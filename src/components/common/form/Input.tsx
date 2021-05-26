import React from 'react';

export default function Input({errors, label, placeholder, ...rest}) {
  const isInvalid = errors[rest.name]?.message
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
