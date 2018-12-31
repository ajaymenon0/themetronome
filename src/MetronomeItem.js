import React from 'react';
import PropTypes from 'prop-types';

const MetronomeItem = ({
  tempo,
  bars,
  isPlaying,
  handleTempoChange,
  handleBarChange,
  beatCounter,
  metronomeIndex,
  currentIndexValue,
}) => (
  <div className="metronome">
    <div className="row">
      <div className="title">
        <h2>TEMPO</h2>
        <h2>{tempo}</h2>
      </div>
      <input type="range" disabled={isPlaying} value={tempo} indexValue={metronomeIndex} min="30" max="290" step="5" className="slider" onChange={handleTempoChange} />
    </div>
    <div className="row">
      <div className="title">
        <h2>BARS</h2>
        <h2>{isPlaying && (metronomeIndex === currentIndexValue) && (beatCounter !== 0) ? `${Math.ceil(beatCounter / 4)} / ${bars}` : bars}</h2>
      </div>
      <input type="range" disabled={isPlaying} value={bars} indexValue={metronomeIndex} min="1" max="30" className="slider" onChange={handleBarChange} />
    </div>
  </div>
);

MetronomeItem.defaultProps = {
  tempo: 60,
  bars: 1,
  isPlaying: false,
  beatCounter: 0,
  handleTempoChange: () => {},
  handleBarChange: () => {},
  metronomeIndex: 0,
  currentIndexValue: 0,
};

MetronomeItem.propTypes = {
  tempo: PropTypes.number,
  bars: PropTypes.number,
  isPlaying: PropTypes.bool,
  beatCounter: PropTypes.number,
  handleTempoChange: PropTypes.func,
  handleBarChange: PropTypes.func,
  metronomeIndex: PropTypes.number,
  currentIndexValue: PropTypes.number,
};

export default MetronomeItem;
