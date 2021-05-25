import React, { useEffect, useMemo, useState } from 'react';
import ReactSelect from 'react-select';
import { components } from 'react-select';
import ErrorBoundary from '../../Fallback/ErrorBoundary';

export default function MultiSelect(props) {
  return (
    <ErrorBoundary>
      <_MultiSelect {...props} />
    </ErrorBoundary>
  );
}
function _MultiSelect(props) {
  let { field, label, formik, handleChange, isClearable, disabled, options, value, ...rest } = props;
  let [selected, setSelect] = useState(value);
  useEffect(() => {
    value !== undefined && setSelect(value);
  }, [value]);
  options = useMemo(() => {
    return options && options.sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);
  let isInValid, touch;
  if (formik) {
    let { setFieldValue, setFieldTouched, errors, touched } = formik;
    touch = setFieldTouched;
    isInValid = props.defaultValue ? errors[field] : touched[field] && errors[field];
    !handleChange && (handleChange = setFieldValue);
  }
  function handleOnChange(selected) {
    !formik && setSelect(selected);
    handleChange(field, selected || []);
  }
  function handleOnBlur() {
    touch && touch(field, true, true);
  }
  const customStyles = {
    container: (provided) => {
      if (isInValid) {
        return {
          ...provided,
          outline: '1px red solid',
        };
      } else {
        return provided;
      }
    },
  };
  return (
    <div className={label ? 'mb-3' : undefined}>
      {label && <label>{label}</label>}
      <ReactSelect
        value={formik ? formik.values[field] : selected || []}
        options={options}
        style={customStyles}
        components={{ Option, ValueContainer, MultiValue }}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        isClearable={isClearable !== undefined ? isClearable : true}
        isDisabled={disabled || false}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isMulti
        {...rest}
      />
      {isInValid && <div style={{ color: '#e62a2a', fontSize: '0.75em', marginTop: '3px' }}>{isInValid}</div>}
    </div>
  );
}
const Option = (props) => {
  return (
    <div>
      <components.Option {...props} className="bg-light">
        <input type="checkbox" checked={props.isSelected} onChange={() => null} /> <span>{props.label}</span>
      </components.Option>
    </div>
  );
};

const ValueContainer = ({ children, ...props }) => {
  const currentValues = props.getValue();
  let toBeRendered = children;
  if (currentValues.length >= 2) {
    toBeRendered = [currentValues.length + ' mục ', children[1]];
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
