import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import WithController from './WithController';
interface Option {
  value: any,
  label: string
}

function _Select({options, ...rest}){
  options = useMemo(() => {
    return options && options.sort((a: Option, b: Option) => a.label?.localeCompare(b.label)) || [];
  }, [options]);

  return (
    <ReactSelect
      options={options}
      {...rest}
    />
  )
}
export default WithController(_Select)
