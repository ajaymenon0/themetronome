import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const MetronomeItem = ({
  tempo, bars, isPlaying, handleTempoChange, handleBarChange, beatCounter,
}) => (
  <Fragment>
    <div className="row">
      <div className="title">
        <h2>TEMPO</h2>
        <h2>{tempo}</h2>
      </div>
      <input type="range" value={tempo} min="30" max="290" className="slider" onChange={handleTempoChange} />
    </div>
    <div className="row">
      <div className="title">
        <h2>BARS</h2>
        <h2>{isPlaying ? `${Math.ceil(beatCounter / 4)} / ${bars}` : bars}</h2>
      </div>
      <input type="range" value={bars} min="1" max="30" className="slider" onChange={handleBarChange} />
    </div>
  </Fragment>
);

MetronomeItem.defaultProps = {
  tempo: 60,
  bars: 1,
  isPlaying: false,
  beatCounter: 0,
  handleTempoChange: () => {},
  handleBarChange: () => {},
};

MetronomeItem.propTypes = {
  tempo: PropTypes.number,
  bars: PropTypes.number,
  isPlaying: PropTypes.bool,
  beatCounter: PropTypes.number,
  handleTempoChange: PropTypes.func,
  handleBarChange: PropTypes.func,
};

export default MetronomeItem;
