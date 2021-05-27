import React, { useState, useRef, useEffect, useMemo } from 'react';
import APIProvider from '../../../util/api/url/APIProvider';
import { callGet } from '../../../hooks/useRequest';
import HistoryManager from '../../../util/InputTextHistory';

/*must change to use with react-hook-form*/

function usersChecked({ validatedUserList, onChange: handleChange, ...props }) {
  let [inputValue, _setInputValue] = useState('');
  let [showBoard, setBoardShow] = useState(false);
  let textManager = useMemo(() =>new HistoryManager(),[]);
  let inputRef = useRef();
  let {field, label, placeholder} = props;
  resetSubcriberStore &&
    (resetSubcriberStore[field] = () => {
      _setInputValue('');
      textManager.reset();
    });
  let isInvalid = touched[field] && errors[field];
  let selections = values[field] || [];
  useEffect(() => {
    if (selections.length && !inputValue) {
      setInputValue(selections.map((cur) => cur.label).join(';'));
    }
  });
  function setInputValue(text, isIgnoreRecord) {
    if (!isIgnoreRecord) {
      let { selectionStart: start, selectionEnd: end } = inputRef.current;
      textManager.createNewRecord(text, start, end);
    }
    _setInputValue(text);
  }
  function callsearch(strVal) {
    let newOptions = [];
    let pa = strVal.split(/;|,/).filter((cur, i, arr) => cur && arr.indexOf(cur) === i);
    if (validatedUserList) {
      pa.map((username) => {
        let user = validatedUserList.find((user) => user.label === username);
        if (user) {
          newOptions.push(user);
        } else {
          newOptions.push({ label: username, value: null, verified: false });
        }
      });
      return handleChange(newOptions);
    }

    pa.map((username) => {
      return callGet(APIProvider.getUrl('USER_LIST'), {
        params: {
          filter: `userName=="${username}"`,
        },
      }).then((res) => {
        res.text = username;
        return res;
      });
    });
    Promise.all(pa).then((datas) => {
      datas.map((data) => {
        if (data.data && data.data.content && data.data.content.length) {
          data.data.content.map((user) => {
            newOptions.push({ label: user.userName, value: user.id, verified: true });
          });
        } else if (data.text) {
          newOptions.push({ label: data.text, value: null, verified: false });
        }
      });
      handleChange(newOptions);
    });
  }
  function handleInputChange(e) {
    e.preventDefault();
    handleMouseOver();
    let newValue;
    if (typeof e === 'string') {
      newValue = e;
    } else {
      newValue = e.target.value;
    }
    setInputValue(newValue);
    if (/\s/.test(newValue)) {
      return setFieldError(field, 'Giá trị nhập vào không được chứa dấu cách');
    }
    callsearch(newValue);
  }
  function handleKeyDown(e) {
    let input = e.target;
    if (e.code === 'Space') {
      e.preventDefault();
    }
    if (e.code === 'KeyZ' && e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      let prev = textManager.undo();
      if (prev) {
        setInputValue(prev.text, true);
        prev.start && prev.end && input.setSelectionRange(prev.start, prev.end);
        callsearch(prev.text);
      }
    }
    if (e.code === 'KeyZ' && e.ctrlKey && e.shiftKey) {
      let next = textManager.redo();
      if (next) {
        setInputValue(next.text, true);
        next.start && next.end && input.setSelectionRange(next.start, next.end);
        callsearch(next.text);
      }
    }
  }
  function handlePaste(e) {
    let input = e.target;
    let clipboardData = e.clipboardData;
    if (clipboardData.types.indexOf('text/plain') > -1) {
      e.preventDefault();
      let text = e.clipboardData.getData('text/plain');
      text = text.replace(/[\n\r\t,;]+/g, ';');
      text = text.replace(/\s+/g, '');
      let start = input.selectionStart;
      let end = input.selectionEnd;
      let newText = inputValue.slice(0, start) + text + inputValue.slice(end, inputValue.length);
      setInputValue(newText);
      callsearch(newText);
      setTimeout(() => {
        input.setSelectionRange(start + text.length, start + text.length);
      }, 20);
    }
  }

  function Option({ verified, label, index }) {
    let [show, setShow] = useState(false);
    function handleMouseOver() {
      if (!show) {
        setShow(true);
      }
    }
    function handleMouseLeave() {
      if (show) {
        setShow(false);
      }
    }
    function handleClose() {
      let reg = new RegExp(`\\b${label};|\\b${label}$`, 'g');
      let replace = inputValue.replace(reg, '');
      setInputValue(replace);
      selections.splice(index, 1);
      handleChange([...selections]);
    }
    return (
      <span onMouseLeave={handleMouseLeave} onMouseOver={handleMouseOver} className={`border rounded badge mr-2 border-${verified ? 'success' : 'danger'}`}>
        <i onClick={handleClose} style={{ opacity: 0.6, marginRight: '5px' }} className={`far fa-times-circle text-danger`} />
        <span>{label}</span>
      </span>
    );
  }
  function handleMouseOver() {
    if (!showBoard) {
      setBoardShow(true);
    }
  }
  function handleMouseLeave() {
    if (showBoard) {
      setBoardShow(false);
    }
  }
  return (
    <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      {label && <label>{label}</label>}
      <div style={{ position: 'relative' }}>
        <input
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleTouch}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="form-control"
          ref={inputRef}
          placeholder={placeholder}
        />
        {isInvalid && <small className='text-danger'>{isInvalid}</small>}
        {selections && !!selections.length && (
          <div
            className="p-1"
            style={{
              position: 'absolute',
              top: isInvalid ? '60px' : '38px',
              maxHeight: '400px',
              width: '100%',
              overflow: 'auto',
              backgroundColor: 'whitesmoke',
              display: showBoard ? 'block' : 'none',
              zIndex: 1,
            }}
          >
            {selections.map((user, i) => (
              <Option index={i} option={user} verified={user.verified} label={user.label} key={`${user.id}-${i}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
