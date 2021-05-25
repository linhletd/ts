import React from 'react';

import Error from './Error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.debug(`Error from ErrorBoundary: ${error}`);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Error isPageLevel={this.props.isPageLevel} hasBigSizeMessage={this.props.hasBigSizeMessage} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
