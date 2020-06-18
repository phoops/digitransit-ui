import connectToStores from 'fluxible-addons-react/connectToStores';
import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import { getJson } from '../../../util/xhrPromise';
import MarkerPopupBottom from '../MarkerPopupBottom';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import Loading from '../../Loading';
import ZoneIcon from '../../ZoneIcon';
import PreferencesStore from '../../../store/PreferencesStore';
import { getLabel } from '../../../util/suggestionUtils';
import { reverseGeocode } from '../../../util/searchUtils';
import { getZoneLabelColor } from '../../../util/mapIconUtils';
import { addAnalyticsEvent } from '../../../util/analyticsUtils';

class LocationPopup extends React.Component {
  static contextTypes = {
    config: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  static propTypes = {
    language: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
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
    const language = this.props.language;
    const reverseGeocodingUrl =
      `${this.context.config.URL.MAPBOX}/${this.props.lon},${
        this.props.lat
      }.json?` +
      `language=${language}&access_token=${
        this.context.config.MAPBOX_ACCESS_TOKEN
      }`;

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
    const { zoneId } = this.state.location;
    return (
      <Card>
        <div className="card-padding">
          <CardHeader
            name={this.state.location.address}
            description={this.props.name}
            unlinked
            className="padding-small"
          >
            <ZoneIcon
              showTitle
              zoneId={zoneId}
              zoneLabelColor={getZoneLabelColor(this.context.config)}
            />
          </CardHeader>
        </div>
        <MarkerPopupBottom location={this.state.location} />
      </Card>
    );
  }
}

const connectedComponent = connectToStores(
  LocationPopup,
  [PreferencesStore],
  ({ getStore }) => {
    const language = getStore(PreferencesStore).getLanguage();
    return { language };
  },
);

export { connectedComponent as default, LocationPopup as Component };
