import React from 'react';

//TODO: change to functional component
export default class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    console.debug(`Thumb - file: ${nextProps.file}`);
    if (!nextProps.file) {
      return;
    }

    if (typeof nextProps.file === 'object') {
      this.setState({ loading: true }, () => {
        let reader = new FileReader();

        reader.onloadend = () => {
          this.setState({ loading: false, thumb: reader.result });
        };

        reader.readAsDataURL(nextProps.file);
      });
    } else {
      let url = nextProps.file;
      if (!url.startsWith('http')) {
        url = process.env.REACT_APP_BASE_URL_STATE + url;
      }
      this.setState({ loading: false, thumb: url });
    }
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) {
      return null;
    }

    if (loading) {
      return <p>loading...</p>;
    }

    return <img src={thumb} alt={file.name} className="img-thumbnail mt-2" height={200} width={200} />;
  }
}
