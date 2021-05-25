import 'trix/dist/trix';
import './style.css';
import React from 'react';
import { TrixEditor } from 'react-trix';

export default class Editor extends React.Component {
  render() {
    return <TrixEditor {...this.props} />;
  }
}
