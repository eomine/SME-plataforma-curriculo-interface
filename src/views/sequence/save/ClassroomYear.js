import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import ClassroomYear1 from 'components/objects/ClassroomYear';

class ClassroomYear extends React.PureComponent {
  render() {
    const { color, index, tooltip, year } = this.props;

    const tooltipId = `tooltipClassroomYear${index}`;

    return (
      <Fragment>
        <div data-tooltip-id={tooltipId}>
          <ClassroomYear1 color={color} year={year} />
        </div>
        <Tooltip
          place="bottom"
          id={tooltipId}
          className="tooltip"
        >
          {tooltip}
        </Tooltip>
      </Fragment>
    );
  }
}

ClassroomYear.propTypes = {
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default ClassroomYear;
