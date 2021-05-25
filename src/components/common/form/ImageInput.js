import React, { useEffect, useState, useRef } from 'react';
import Alert from '../Modal/Alert';
// import Thumb from './Thumb';

function ImageInput({ formik, field, label }) {
  let [state, setState] = useState({ loading: false, filename: '', link: '' });
  let inputRef = useRef();
  let value = formik.values[field];
  useEffect(() => {
    if (value instanceof Blob) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setState({ loading: false, link: reader.result, filename: value.name });
      };
      reader.readAsDataURL(value);
    } else {
      setState({
        loading: false,
        link: value,
      });
      if (!value) {
        inputRef.current.value = '';
      }
    }
  }, [value]);

  function handleChange(event) {
    let file = event.currentTarget.files[0];
    if (typeof file === 'object') {
      setState({ loading: true });
    }
    formik.setFieldValue(field, file);
  }
  function Thumbnail() {
    let [alert, setAlert] = useState({ show: false });
    function handleCloseThumbnail() {
      formik.setFieldValue(field, '');
    }
    function handleClickThumnail(e) {
      setAlert({
        content: <img src={e.target.src} className="img-fluid mx-auto d-block" />,
        handleClose: () => {
          setAlert({ show: false, content: '' });
        },
        size: 'xl',
        show: true,
      });
    }
    let { link, filename, loading } = state;
    if (link) {
      let size = 200;
      if (typeof link === 'string' && link.startsWith('/') && !link.startsWith('http')) {
        link = process.env.REACT_APP_BASE_URL_STATE + link;
      }
      return (
        <>
          <div className="mt-2 p-0" style={{ width: `${size}px`, position: 'relative' }}>
            <img src={link} alt={filename} className="img-thumbnail" width="100%" height="100%" onClick={handleClickThumnail} />
            <i className="fas fa-times-circle fa-xs text-lg" style={{ color: '#fc442494', position: 'absolute', top: '-7px', right: '-10px' }} onClick={handleCloseThumbnail} />
          </div>
          <Alert {...alert} headless feetless />
        </>
      );
    } else if (loading) {
      return <small>loading...</small>;
    }
    return null;
  }
  return (
    <div className="form-group mb-3">
      <label htmlFor={field}>{label}</label>
      <input name={field} type="file" onChange={handleChange} className="form-control" accept="image/*" ref={inputRef} />
      <Thumbnail state={state} />
    </div>
  );
}
export default class Wrapper extends React.Component {
  shouldComponentUpdate(nextProps) {
    let { field } = this.props;
    if (nextProps.field !== this.props.field || nextProps.formik.values[field] !== this.props.formik.values[field]) {
      return true;
    }
    return false;
  }
  render() {
    return <ImageInput {...this.props} />;
  }
}
