import React from 'react';
import { format } from 'date-fns';

export default function Timestamp({ ...props }) {
  if (props.timestamp) {
    const date = new Date(props.timestamp);
    return <time>{format(date, 'dd/MM/yyyy HH:mm')}</time>;
  }

  return <div>{'N/A'}</div>;
}
