import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

// eslint-disable-next-line react/display-name
function ButtonUploadExcel({ label, className, onChange, templateFile, loading }) {
  let { t } = useTranslation();
  let inputRef = useRef();
  const handleChange = (event) => {
    let fileInput = event.target;
    let file = fileInput.files;
    onChange(file[[0]]);
    fileInput.value = '';
  };
  function handleClick() {
    inputRef.current.click();
  }
  const handleClickTooltip = () => {
    let url = process.env.REACT_APP_BASE_URL_STATE + `/templates/${templateFile}`;
    let link = document.createElement('a');
    link.target = '_blank';
    link.href = url;
    let filename = templateFile;
    link.download = filename;
    link.click();
  };
  const renderLoading = () => {
    if (loading) {
      return (
        <>
          <i className="fas fa-spinner fa-pulse" />
          &nbsp;
        </>
      );
    }
  };
  const renderTooltip = (props) => (
    <Tooltip {...props} onClick={handleClickTooltip}>
      <a download>{t('app.generics.downloadTemplate')}</a>
    </Tooltip>
  );
  if (templateFile) {
    return (
      <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 250, hide: 1000 }}>
        <div onClick={handleClick} className={'btn btn-primary mb-0 ' + className}>
          {renderLoading()}
          {label} <i className="fas fa-upload pl-2" />
          <input
            ref={inputRef}
            className="buttonImportExcel"
            type="file"
            hidden
            onChange={handleChange}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>
      </OverlayTrigger>
    );
  } else {
    return (
      <div onClick={handleClick} className={'btn btn-primary mb-0 ' + className}>
        {renderLoading()}
        {label} <i className="fas fa-upload pl-2" />
        <input
          ref={inputRef}
          className="buttonImportExcel"
          type="file"
          hidden
          onChange={handleChange}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
    );
  }
}
ButtonUploadExcel.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

ButtonUploadExcel.defaultProps = {
  className: '',
};

export default ButtonUploadExcel;
