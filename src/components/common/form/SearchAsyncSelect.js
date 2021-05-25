import React, { useState, useMemo, useEffect } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet } from '../../../hooks/useRequest';

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
  let [store] = useState({ options: [] });
  let [defaultData, setDefaultData] = useState([]);
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
    defaultValue,
    optionCallback,
    subFilter,
    ...rest
  } = props;
  let subFilterText =
    subFilter &&
    Object.keys(subFilter)
      .map((cur) => `${cur}==${subFilter[cur]}`)
      .join(';');
  useEffect(() => {
    let params = {
      size: 100,
    };
    subFilter && (params.filter = subFilterText);
    return callGet(APIProvider.getUrl(apiKey), {
      params,
    }).then(({ code, data }) => {
      setDefaultData(code === 200 ? data || data.content : []);
    });
  }, [field]);

  let isInValid = props.defaultValue ? errors[field] : touched[field] && errors[field];
  function handleOnChange(option) {
    (handleChange || setFieldValue)(field, option ? option.value : undefined, true);
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
    return obj[labelField];
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

  function _getOptions(arr) {
    return arr
      .reduce((acc, cur) => {
        let opt = {
          value: cur.id,
          label: generateLabel(cur),
        };
        if (optionCallback) {
          opt = optionCallback(cur, opt);
        }
        opt && acc.push(opt);
        return acc;
      }, [])
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  function getOptions(arr) {
    return (store.options = _getOptions(arr));
  }
  function loadOptions(inputValue) {
    let params = {};
    if (inputValue) {
      params.filter = `${filterName}=="*${inputValue.toLowerCase()}*"`;
      if (subFilter) {
        params.filter += ';' + subFilterText;
      }
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
  }

  let defaultOptions = useMemo(() => {
    return _getOptions(defaultData.content || defaultData);
  }, [defaultData, optionCallback]);

  let value = useMemo(() => {
    let val = values[field];
    if (!val) return null;
    if (defaultValue && defaultValue.value === val) {
      return defaultValue;
    }
    let { options = [] } = store;
    options = options.concat(defaultOptions);
    return (options && options.find((cur) => cur.value === val)) || null;
  }, [values[field], store.options]);

  return (
    <div className={label ? 'mb-3 zpri' : undefined}>
      {label && <label>{label}</label>}
      <AsyncSelect
        value={value}
        style={customStyles}
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        isClearable={isClearable !== undefined ? isClearable : true}
        isDisabled={disabled || false}
        {...rest}
      />
      {isInValid && <div style={{ color: '#e62a2a', fontSize: '0.75em', marginTop: '3px' }}>{isInValid}</div>}
    </div>
  );
}
