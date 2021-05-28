import React, { useMemo } from 'react';
import ReactSelect, { components } from 'react-select';
import withController from './withController';
import {useTranslation} from 'react-i18next';

interface Option {
  value: any,
  label: string
}

function Select({errors, isMulti, options, isClearable, disabled, label, placeholder, ...rest}){
  const isInvalid = errors[rest.name]?.message;
  options = useMemo(() => {
    return options && options.sort((a: Option, b: Option) => a.label?.localeCompare(b.label)) || [];
  }, [options]);

  return (
    <>
      {label && <label>{label}</label>}
      <ReactSelect
        options={options}
        placeholder={placeholder || (label ? label + '...' : undefined)}
        components={isMulti ? { Option, ValueContainer, MultiValue }: undefined}
        isClearable={isClearable !== undefined ? isClearable : true}
        isDisabled={disabled || false}
        closeMenuOnSelect={isMulti ? false : undefined}
        hideSelectedOptions={isMulti ? false : undefined}
        isMulti={isMulti || false}
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>

  )
}

const Option = (props) => {
  return (
    <div>
      <components.Option {...props} className="bg-light">
        <input type="checkbox" checked={props.isSelected} onChange={() => null}/> <span>{props.label}</span>
      </components.Option>
    </div>
  );
};

const ValueContainer = ({ children, ...props }) => {
  const {t} = useTranslation();
  const currentValues = props.getValue();
  let toBeRendered = children;
  if (currentValues.length >= 2) {
    toBeRendered = [currentValues.length + t('app.generics.item'), children[1]];
  } else if (currentValues.length === 1) {
    let label = children[0][0].props.data.label;
    if (label.length > 15) {
      label = label.slice(0, 16) + '...';
    }
    toBeRendered = [label, children[1]];
  }
  return <components.ValueContainer {...props}>{toBeRendered}</components.ValueContainer>;
};

const MultiValue = (props) => {
  let labelToBeDisplayed = `${props.data.label}`;
  return (
    <components.MultiValue {...props}>
      <span>{labelToBeDisplayed}</span>
    </components.MultiValue>
  );
};

export default withController(Select)
