import React from 'react';
import CreatableSelect from 'react-select/creatable';

const CreatableSingleSelect = (props) => {
  const handleChange = (newValue) => {
    console.debug(`CreatableSingleSelect ${newValue}`);
    if (newValue) {
      props.setSize(parseInt(newValue.value));
      if (props.handleReload) {
        props.handleReload();
      }
    }
  };
  const Options = [
    {
      value: 10,
      label: 10,
    },
    {
      value: 20,
      label: 20,
    },
    {
      value: 50,
      label: 50,
    },
    {
      value: 100,
      label: 100,
    },
  ];

  return <CreatableSelect className="ml-1" isClearable onChange={handleChange} options={Options} placeholder={props.size} />;
};

export default CreatableSingleSelect;
