import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import MarkerPopupBottom from '../MarkerPopupBottom';
import { getLabel } from '../../../util/suggestionUtils';
import { getJson } from '../../../util/xhrPromise';
import Loading from '../../Loading';

class LocationPopup extends React.Component {
  static contextTypes = {
    config: PropTypes.object.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      location: {
        lat: this.props.lat,
        lon: this.props.lon,
      },
    };
  }

  componentDidMount() {
    const language = this.context.getStore('PreferencesStore').getLanguage();
    const reverseGeocodingUrl = this.context.config.URL.MAPBOX
      + '/' + this.props.lon + ',' + this.props.lat + '.json?'
      + 'language=' + language
      + '&access_token=' + this.context.config.MAPBOX_ACCESS_TOKEN;

    getJson(reverseGeocodingUrl).then(
      data => {
        if (data.features != null && data.features.length > 0) {
          const match = data.features[0].place_name;
          this.setState({
            loading: false,
            location: {
              ...this.state.location,
              address: match,
            },
          });
        } else {
          this.setState({
            loading: false,
            location: {
              ...this.state.location,
              address: this.context.intl.formatMessage({
                id: 'location-from-map',
                defaultMessage: 'Selected location',
              }),
            },
          });
        }
      },
      () => {
        this.setState({
          loading: false,
          location: {
            address: this.context.intl.formatMessage({
              id: 'location-from-map',
              defaultMessage: 'Selected location',
            }),
          },
        });
      },
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="card smallspinner" style={{ height: '4rem' }}>
          <Loading />
        </div>
      );
    }
    return (
      <Card>
        <div className="padding-small">
          <CardHeader
            name={this.state.location.address}
            description={this.props.name}
            unlinked
            className="padding-small"
          />
        </div>
        <MarkerPopupBottom location={this.state.location} />
      </Card>
    );
  }
}

export default LocationPopup;
