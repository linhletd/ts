import React, { useMemo } from 'react';
import Select from './Select';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet, createFetcher } from '../../../util/request';
import useSWR from 'swr';
import withController from './withController';

function SelectAsync({ apiKey, stableQueryKey, params, labelField, valueField, placeholder, excludes, dataCallback, reqMethod, loadedCallback, supplimentOptions, keepDataOnOption, ...rest }) {
  if (reqMethod && reqMethod.toLowerCase() !== 'post') {
    params = {
      params: {
        size: 100,
        ...params,
      },
    };
  }

  const url = APIProvider.getUrl(apiKey);
  const { data, error } = useSWR([url, stableQueryKey], createFetcher(url, params, reqMethod));

  function generateLabel(obj) {
    if (labelField instanceof Array) {
      let label = '';
      labelField.map((cur, i) => {
        label += ` ${i !== 0 ? ' - ' : ''}${obj[cur]}`;
      });
      return label;
    }
    return obj[labelField || 'name'] || 'null';
  }

  function getOptions(arr) {
    return arr.reduce((acc, cur) => {
      let value = valueField ? cur[valueField] : cur.id;
      let option = {
        value,
        label: generateLabel(cur),
      };
      if (dataCallback) {
        option = dataCallback(option, cur);
      }
      option && acc.push(option);
      return acc;
    }, []);
  }
  let options = useMemo(() => {
    if (supplimentOptions) {
      return supplimentOptions.concat(getOptions(data.content || data));
    } else {
      return getOptions(data.content || data);
    }
  }, [data]);

  if (status === 'loading') {
    placeholder = 'loading...';
  } else if (status === 'error') {
    placeholder = 'load failed!';
  }

  return <Select placeholder={placeholder} options={options} {...rest} />;
}
export default withController(SelectAsync)