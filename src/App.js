import React, { Component } from 'react';
import classnames from 'classnames';
import MetronomeItem from './MetronomeItem';
import Worker from './timer.worker';

class App extends Component {
  constructor(props) {
    super(props);
    this.onPlayPause = this.onPlayPause.bind(this);
    this.metronome = this.metronome.bind(this);
    this.playPauseHandler = this.playPauseHandler.bind(this);
    this.changeTempo = this.changeTempo.bind(this);
    this.changeBars = this.changeBars.bind(this);
    this.addMetronome = this.addMetronome.bind(this);
    this.state = {
      isPlaying: false,
      tempo: [120],
      bars: [1],
      beatCounter: 0,
    };
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.indexOfMetronomes = 0;
    this.totalMetronomes = 1;
    this.worker = new Worker();
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
      this.worker.postMessage(0);
      this.metronome();
    } else {
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
    const interval = (60 / tempo[this.indexOfMetronomes]) * 1000;
    if (isPlaying) {
      this.worker.postMessage(interval);
      this.worker.onmessage = () => {
        this.onPlayPause();
      };
    } else {
      this.worker.postMessage(0);
    }
  }

  changeBars(event) {
    const { bars } = this.state;
    const indexvalue = event.target.getAttribute('indexvalue');
    const tempBar = Object.assign([...bars], { [indexvalue]: parseInt(event.target.value, 10) });
    this.setState({
      bars: tempBar,
    });
  }

  changeTempo(event) {
    const { tempo } = this.state;
    const indexvalue = event.target.getAttribute('indexvalue');
    const tempTempo = Object.assign([...tempo], { [indexvalue]: parseInt(event.target.value, 10) });
    this.setState({
      tempo: tempTempo,
      beatCounter: 0,
    });
  }

  addMetronome() {
    const { tempo, bars } = this.state;
    const tempTempo = [...tempo];
    const tempBars = [...bars];
    tempTempo.push(120);
    tempBars.push(1);
    this.totalMetronomes = this.totalMetronomes + 1;
    this.setState({
      tempo: tempTempo,
      bars: tempBars,
    });
  }

  render() {
    const {
      isPlaying, bars, tempo, beatCounter,
    } = this.state;
    const children = tempo.map((unit, index) => React.cloneElement(<MetronomeItem />, {
      tempo: tempo[index],
      isPlaying,
      bars: bars[index],
      beatCounter,
      handleTempoChange: this.changeTempo,
      handleBarChange: this.changeBars,
      metronomeIndex: index,
      currentIndexValue: this.indexOfMetronomes,
    }));
    return (
      <div>
        <h1>THE METRONOME</h1>
        <div className="controls">
          <div className="row">
            <button className={classnames('playPauseBtn', { stopped: isPlaying })} type="submit" onClick={this.playPauseHandler}>{isPlaying ? 'STOP' : 'PLAY'}</button>
          </div>
          {children}
          <div className="row addSet">
            <button type="button" className="addSetBtn" onClick={this.addMetronome}>+</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
