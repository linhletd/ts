import React, { useMemo } from 'react';
import ReactSelect, { components } from 'react-select';
import {useTranslation} from 'react-i18next';
import withController from './withController';


function MultiSelect(props) {
  let { label, placeholder, isClearable, disabled, options, isInvalid, ...rest } = props;
  options = useMemo(() => {
    return options && options.sort((a, b) => a.label.localeCompare(b.label)) || [];
  }, [options]);

  return (
    <>
      {label && <label>{label}</label>}
      <ReactSelect
        options={options}
        components={{ Option, ValueContainer, MultiValue }}
        isClearable={isClearable !== undefined ? isClearable : true}
        isDisabled={disabled || false}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        placeholder={placeholder || (label ? label + '...' : undefined)}
        isMulti
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>
  );
}
const Option = (props) => {
  return (
    <div>
      <components.Option {...props} className="bg-light">
        <input type="checkbox" checked={props.isSelected} /> <span>{props.label}</span>
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

export default withController(MultiSelect)