import React, { useMemo } from 'react';
import Select from './Select';
import APIProvider from '../../../util/api/url/APIProvider';
import { createFetcher } from '../../../util/request';
import useSWR from 'swr';

function SelectAsync({ apiKey, stableQueryKey, shouldDisable, query, labelField, valueField, placeholder, excludes, dataCallback, reqMethod, loadedCallback, supplimentOptions, keepDataOnOption, ...rest }) {
  if (!reqMethod || reqMethod.toLowerCase() !== 'post') {
    query = {
      params: {
        size: 100,
        ...query,
      },
    };
  }
  const url = APIProvider.getUrl(apiKey);
  const { data, error } = useSWR(!shouldDisable && [url, stableQueryKey], createFetcher(url, query, reqMethod));

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
    if(data){
      if (supplimentOptions) {
        return supplimentOptions.concat(getOptions(data.content || data));
      } else {
        return getOptions(data.content || data);
      }
    }
    return []
  }, [data]);

  if (!error && !data) {
    placeholder = 'loading...';
  } else if (error) {
    placeholder = 'load failed!';
  }

  return <Select placeholder={placeholder} options={options} {...rest} />;
}
export default SelectAsync