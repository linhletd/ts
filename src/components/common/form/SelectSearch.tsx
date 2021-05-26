import React, { useState, useMemo, useEffect } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet } from '../../../util/request';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import withController from './withController';

interface Params {
  size?: number,
  filter?: string
}

function SearchSelectAsync( {isMulti, apiKey, filterName, labelField, label, onChange, isClearable, isInvalid, disabled, subFilter, ...rest }) {
  
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

export default withController(SearchSelectAsync);