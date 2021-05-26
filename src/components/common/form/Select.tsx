import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import withController from './withController';
interface Option {
  value: any,
  label: string
}

function Select({options, isInvalid, label, placeholder, ...rest}){
  options = useMemo(() => {
    return options && options.sort((a: Option, b: Option) => a.label?.localeCompare(b.label)) || [];
  }, [options]);

  return (
    <>
      {label && <label>{label}</label>}
      <ReactSelect
        options={options}
        placeholder={placeholder || (label ? label + '...' : undefined)}
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>

  )
}
export default withController(Select)
