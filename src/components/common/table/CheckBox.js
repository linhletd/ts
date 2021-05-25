import React, { useMemo } from 'react';

export default function CheckBox(props) {
  let { handleChange, checked } = props;
  function handleCheck(e) {
    let val = e.target.checked;
    handleChange(val);
  }
  return (
    <>
      <input type="checkbox" onChange={handleCheck} checked={checked} />
    </>
  );
}

export function CheckBox1({ handleCheck, row, checkedList }) {
  let idx = checkedList.indexOf(row.id);
  let checked = idx >= 0;
  function handleChange() {
    let newList = [...checkedList];
    if (checked) {
      newList.splice(idx, 1);
    } else {
      newList.push(row.id);
    }
    handleCheck(newList);
  }
  return (
    <>
      <input type="checkbox" onChange={handleChange} checked={checked} />
    </>
  );
}
export function AllCheckBox({ checkedList, data, handleCheck }) {
  let checked = useMemo(() => {
    return data.length !== 0 && data.every((row) => checkedList.includes(row.id));
  }, [checkedList, data]);
  function handleChange() {
    let s = new Set(checkedList);
    if (checked) {
      data.map((row) => s.delete(row.id));
    } else {
      data.map((row) => s.add(row.id));
    }
    handleCheck([...s.values()]);
  }
  return <input type="checkbox" onChange={handleChange} checked={checked} />;
}
