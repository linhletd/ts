import React, { useState, useMemo, useEffect } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet } from '../../../util/request';
import AsyncSelect from 'react-select/async';
import withController from './withController';

interface Params {
  size?: number,
  filter?: string
}

function SearchSelectAsync( {apiKey, filterName, labelField, label, onChange, isClearable, isInvalid, disabled, subFilter, ...rest }) {
  
  let [defaultData, setDefaultData] = useState([]);
  let subFilterText = subFilter &&
    Object.keys(subFilter).map((cur) => `${cur}==${subFilter[cur]}`).join(';');

  useEffect(() => {
    let params: Params = {
      size: 100,
    };
    subFilter && (params.filter = subFilterText);
    callGet(APIProvider.getUrl(apiKey), {
      params,
    }).then(({ code, data }) => {
      setDefaultData(code === 200 ? data || data.content : []);
    });
  }, [rest.name]);

  function generateLabel(obj) {
    if (labelField instanceof Array) {
      let label = '';
      labelField.map((cur, i) => {
        label += ` ${i !== 0 ? ' - ' : ''}${obj[cur]}`;
      });
      return label;
    }
    return obj[labelField || 'name'];
  }

  function getOptions(arr) {
    return arr
      .reduce((acc, cur) => {
        let opt = {
          value: cur.id,
          label: generateLabel(cur),
        };
        opt && acc.push(opt);
        return acc;
      }, [])
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  function loadOptions(inputValue) {
    let params:Params = {};
    if (inputValue) {
      params.filter = `${filterName || 'name'}=="*${inputValue.toLowerCase()}*"`;
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
    return getOptions(defaultData);
  }, [defaultData]);

  return (
    <>
      {label && <label>{label}</label>}
      <AsyncSelect
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        isClearable={isClearable !== undefined ? isClearable : true}
        isDisabled={disabled || false}
        {...rest}
      />
      {isInvalid && <small className='text-danger'>{isInvalid}</small>}
    </>
  );
}

export default withController(SearchSelectAsync);