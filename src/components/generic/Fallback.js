import React from 'react';
import { useTranslation } from 'react-i18next';

import BrowserProvider from '../../util/browser/BrowserProvider';

const style = {
  wrapper: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '30%',
  },
  reloadButton: {
    cursor: 'pointer',
  },
};

const Fallback = ({ image, altImage, text, isPageLevel, hasBigSizeMessage }) => {
  const { t } = useTranslation();

  return (
    <div style={style.wrapper} className="p-2">
      <img src={image} style={style.image} alt={altImage} />
      {isPageLevel || hasBigSizeMessage ? <h3 className="text-center">{text}</h3> : <p className="text-center">{text}</p>}

      {isPageLevel && (
        <a style={style.reloadButton} href={BrowserProvider.getUrl('HOME')} target="_self">
          {t('page.fallback.reload.text')}
        </a>
      )}
    </div>
  );
};

export default Fallback;
