import React, { Component } from 'react';
import classnames from 'classnames';
import MetronomeItem from './MetronomeItem';

class App extends Component {
  constructor(props) {
    super(props);
    this.onPlayPause = this.onPlayPause.bind(this);
    this.metronome = this.metronome.bind(this);
    this.playPauseHandler = this.playPauseHandler.bind(this);
    this.changeTempo = this.changeTempo.bind(this);
    this.changeBars = this.changeBars.bind(this);
    this.state = {
      isPlaying: false,
      tempo: [60, 120],
      bars: [2, 3],
      beatCounter: 0,
    };
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.metronomeObject = '';
    this.indexOfMetronomes = 0;
    this.totalMetronomes = 2;
  }

  onPlayPause() {
    const osc = this.audioCtx.createOscillator();
    const { bars, beatCounter } = this.state;
    osc.type = 'triangle';
    osc.detune.value = beatCounter % 4 === 0 ? 1200 : 900;
    osc.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
    if (beatCounter + 1 >= bars[this.indexOfMetronomes] * 4) {
      this.indexOfMetronomes = this.indexOfMetronomes + 1;
      if (this.indexOfMetronomes >= this.totalMetronomes) {
        this.playPauseHandler();
        this.indexOfMetronomes = 0;
      }
      this.setState({
        beatCounter: 0,
      });
    } else {
      this.metronome();
      this.setState({
        beatCounter: beatCounter + 1,
      });
    }
  }

  playPauseHandler() {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying, beatCounter: 0 }, () => this.metronome());
  }

  metronome() {
    const { isPlaying, tempo } = this.state;
    if (isPlaying) {
      clearInterval(this.metronomeObject);
      this.metronomeObject = setInterval(() => {
        this.onPlayPause();
      }, (60 / tempo[this.indexOfMetronomes]) * 1000);
    } else {
      clearInterval(this.metronomeObject);
    }
  }

  changeBars(event) {
    const { bars } = this.state;
    const indexvalue = event.target.getAttribute('indexvalue');
    const tempBar = Object.assign([...bars], { [indexvalue]: parseInt(event.target.value, 10) });
    this.setState({
      bars: tempBar,
    }, () => this.metronome());
  }

  changeTempo(event) {
    const { tempo } = this.state;
    const indexvalue = event.target.getAttribute('indexvalue');
    const tempTempo = Object.assign([...tempo], { [indexvalue]: parseInt(event.target.value, 10) });
    this.setState({
      tempo: tempTempo,
      beatCounter: 0,
    }, () => this.metronome());
  }

  render() {
    const {
      isPlaying, bars, tempo, beatCounter,
    } = this.state;
    return (
      <div>
        <h1>THE METRONOME</h1>
        <div className="controls">
          <div className="row">
            <button className={classnames('playPauseBtn', { stopped: isPlaying })} type="submit" onClick={this.playPauseHandler}>{isPlaying ? 'STOP' : 'PLAY'}</button>
          </div>
          <MetronomeItem
            tempo={tempo[0]}
            isPlaying={isPlaying}
            bars={bars[0]}
            beatCounter={beatCounter}
            handleTempoChange={this.changeTempo}
            handleBarChange={this.changeBars}
            indexValue={0}
            currentIndexValue={this.indexOfMetronomes}
          />
          <MetronomeItem
            tempo={tempo[1]}
            isPlaying={isPlaying}
            bars={bars[1]}
            beatCounter={beatCounter}
            handleTempoChange={this.changeTempo}
            handleBarChange={this.changeBars}
            indexValue={1}
            currentIndexValue={this.indexOfMetronomes}
          />
          {/* <div className="row addSet">
            <button type="button" className="addSetBtn">+</button>
          </div> */}
        </div>
      </div>
    );
  }
}

export default App;
