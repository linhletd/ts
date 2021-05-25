import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactAudioPlayer from 'react-audio-player';

export default function AudioPlay({ src, preload }) {
  const { t } = useTranslation();

  if (!src) {
    return <small className="text-danger">{t('components.audio.noFile')}</small>;
  }
  if (!src.startsWith('http') && !src.startsWith('/')) {
    return <small className="text-danger">{t('components.audio.noAnswer')}</small>;
  }
  if (!src.startsWith('http')) {
    src = process.env.REACT_APP_BASE_URL_STATE_MEDIA + src;
  }
  return <ReactAudioPlayer src={src} autoPlay={false} controls preload={preload || 'none'} />;
}
