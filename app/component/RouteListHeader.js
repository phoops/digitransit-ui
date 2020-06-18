import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

const RouteListHeader = ({ displayNextDeparture, className }) => (
  <div
    className={cx(
      'route-list-header route-stop row padding-vertical-small',
      className,
    )}
  >
    <div className="route-stop-now" />
    <div className="route-stop-name">
      <FormattedMessage id="stop" defaultMessage="Stop" />
    </div>
    <div className="route-stop-time" style={{ flex: '0 1 auto' }}>
      <FormattedMessage id="next-departures" defaultMessage="Next departures" />
    </div>
    {displayNextDeparture ? (
      <div className="route-stop-time">
        <FormattedMessage id="next" defaultMessage="Next" />
      </div>
    ) : (
      ''
    )}
  </div>
);

RouteListHeader.propTypes = {
  className: PropTypes.string,
  displayNextDeparture: PropTypes.bool,
};

RouteListHeader.defaultProps = {
  displayNextDeparture: true,
};

export default RouteListHeader;
