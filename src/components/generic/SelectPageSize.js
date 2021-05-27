import React from 'react';
import CreatableSelect from 'react-select/creatable';

const options = [10, 20, 50, 100].map(num =>({value: num, label: num}))
const CreatableSingleSelect = ({size, setSize}) => {
  const handleChange = (newValue) => {
    console.debug(`CreatableSingleSelect ${newValue}`);
    if (newValue) {
      setSize(parseInt(newValue.value));
    }
  };

  return <CreatableSelect className="ml-1" isClearable onChange={handleChange} options={options} placeholder={size} />;
};

export default CreatableSingleSelect;
