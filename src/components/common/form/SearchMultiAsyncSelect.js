import React, { useMemo } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet, useGet } from '../../../hooks/useRequest';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import ErrorBoundary from '../../Fallback/ErrorBoundary';

export default function SearchAsyncSelect(props) {
  return (
    <ErrorBoundary>
      <_SearchAsyncSelect {...props} />
    </ErrorBoundary>
  );
}

function _SearchAsyncSelect(props) {
  let {
    apiKey,
    filterName = 'name',
    labelField = 'name',
    field,
    label,
    formik: { setFieldValue, setFieldTouched, errors, touched, values },
    handleChange,
    isClearable,
    disabled,
    dataCallback,
    linkedField,
    ...rest
  } = props;

  let { data: defaultData } = useGet([apiKey], APIProvider.getUrl(apiKey), {
    params: {
      size: 100,
    },
  });

  let initDefaultOpts = useMemo(() => {
    if (!defaultData) return [];
    return getOptions(defaultData.content, true);
  }, [defaultData]);

  let defaultOptions = useMemo(() => {
    let opts = initDefaultOpts;
    let fieldValues = values[field];
    if (fieldValues && fieldValues instanceof Array) {
      let filtered = initDefaultOpts.filter((cur) => {
        return !fieldValues.some((elem) => elem.value === cur.value);
      });
      fieldValues && (opts = fieldValues.concat(filtered));
    }
    return opts;
  }, [values[linkedField], values[field], initDefaultOpts]);

  let isInValid = props.defaultValue ? errors[field] : touched[field] && errors[field];
  function handleOnChange(selected) {
    (handleChange || setFieldValue)(field, selected || []);
  }
  function handleOnBlur() {
    setFieldTouched(field, true, true);
  }
  function generateLabel(obj) {
    if (labelField instanceof Array) {
      let label = '';
      labelField.map((cur, i) => {
        label += ` ${i !== 0 ? ' - ' : ''}${obj[cur]}`;
      });
      return label;
    }
    return obj[labelField] || 'null';
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

  function getOptions(arr, isDefault) {
    if (!arr) {
      console.log('invalid input');
      return [];
    }
    let output = arr.reduce((acc, cur) => {
      let option = {
        value: cur.id,
        label: generateLabel(cur),
      };

      if (dataCallback) {
        option = dataCallback(cur, option);
      }
      return (option && acc.concat(option)) || acc;
    }, []);
    if (!isDefault) {
      values[field] instanceof Array &&
        values[field].map((cur) => {
          if (!output.find((elem) => elem.value === cur.value)) {
            output.push(cur);
          }
        });
    }
    return output.sort((a, b) => a.label.localeCompare(b.label));
  }
  function loadOptions(inputValue) {
    let params = {};
    if (inputValue) {
      params.filter = `${filterName}=="*${inputValue.toLowerCase()}*"`;
      return callGet(APIProvider.getUrl(apiKey), {
        params: {
          size: 100,
          ...params,
        },
      }).then(({ code, data }) => {
        if (code === 200) {
          return getOptions(data.content || data);
        }
        return [];
      });
    }
    return Promise.resolve([]);
  }
  return (
    <div className={label ? 'mb-3' : undefined}>
      {label && <label>{label}</label>}
      <AsyncSelect
        value={values[field] || []}
        style={customStyles}
        cacheOptions={!dataCallback}
        defaultOptions={defaultOptions}
        components={{ Option, ValueContainer, MultiValue }}
        loadOptions={loadOptions}
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
