import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';

class Tooltips extends React.PureComponent {
  render() {
    const { salt } = this.props;
    let id1 = 'tooltipKnowledgeMatrices';
    let id2 = 'tooltipLearningObjectives';
    let id3 = 'tooltipDevelopmentGoals';
    if (salt > 0) {
      id1 += '-' + salt;
      id2 += '-' + salt;
      id3 += '-' + salt;
    }

    return (
      <Fragment>
        <Tooltip
          place="bottom"
          id={id1}
          className="tooltip"
        >
          <strong>O que são as matrizes de saberes?</strong>
          <p>
            O desenvolvimento que procura satisfazer as necessidades da geração
            atual, sem comprometer a capacidades das gerações futuras de
            satisfazerem as suas próprias necessidades.
          </p>
        </Tooltip>
        <Tooltip
          place="bottom"
          id={id2}
          className="tooltip"
        >
          <strong>O que são os objetivos de aprendizagem?</strong>
          <p>
            O desenvolvimento que procura satisfazer as necessidades da geração
            atual, sem comprometer a capacidades das gerações futuras de
            satisfazerem as suas próprias necessidades.
          </p>
        </Tooltip>
        <Tooltip
          place="bottom"
          id={id3}
          className="tooltip"
        >
          <strong>O que são os ODS?</strong>
          <p>
            O desenvolvimento que procura satisfazer as necessidades da geração
            atual, sem comprometer a capacidades das gerações futuras de
            satisfazerem as suas próprias necessidades.
          </p>
        </Tooltip>
      </Fragment>
    );
  }
}

Tooltips.propTypes = {
  salt: PropTypes.number,
};

export default Tooltips;
