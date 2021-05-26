import React from 'react';

const Input =  React.forwardRef((props: any, ref) => {
  let {errors, label, placeholder, ...rest} = props;
  const isInvalid = errors[rest.name]?.message;
    return (
      <>
        {label && <label>{label}</label>}
        <input
        className='form-control'
          placeholder={placeholder || (label ? label + '...' : undefined)}
          {...rest}
          ref={ref}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
      </>
    );
})

export default Input;