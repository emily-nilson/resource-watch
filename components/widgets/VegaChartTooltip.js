import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3';

class VegaChartTooltip extends React.Component {

  getParsedX() {
    const { item } = this.props;
    if (item && typeof item.x === 'number') {
      return format('.0f')(item.x);
    }

    if (item && typeof item.x === 'string') {
      return item.x;
    }

    return '';
  }

  getParsedY() {
    const { item } = this.props;
    if (item && typeof item.y === 'number') {
      return format('.2s')(item.y);
    }

    if (item && typeof item.y === 'string') {
      return item.y;
    }

    return '';
  }


  render() {
    return (
      <div>
        <div>{this.getParsedX()}</div>
        <div>{this.getParsedY()}</div>
      </div>
    );
  }
}

VegaChartTooltip.propTypes = {
  // Define the chart data
  item: PropTypes.shape({
    // PropTypes.object being a date object
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
  })
};

export default VegaChartTooltip;
