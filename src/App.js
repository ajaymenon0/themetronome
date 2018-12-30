import React, { Component } from 'react';
import classnames from 'classnames';

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
      tempo: 60,
      bars: 2,
      beatCounter: 0,
    };
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.metronomeObject = '';
  }

  onPlayPause() {
    const osc = this.audioCtx.createOscillator();
    const { bars, beatCounter } = this.state;
    osc.type = 'triangle';
    osc.detune.value = beatCounter % 4 === 0 ? 1200 : 900;
    osc.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
    if (beatCounter + 1 >= bars * 4) {
      this.playPauseHandler();
      this.setState({
        beatCounter: 0,
      });
    } else {
      this.setState({
        beatCounter: beatCounter + 1,
      });
    }
  }

  playPauseHandler() {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying }, () => this.metronome());
  }

  metronome() {
    const { isPlaying, tempo } = this.state;
    if (isPlaying) {
      clearInterval(this.metronomeObject);
      this.metronomeObject = setInterval(() => {
        this.onPlayPause();
      }, (60 / tempo) * 1000);
    } else {
      clearInterval(this.metronomeObject);
    }
  }

  changeBars(event) {
    this.setState({
      bars: event.target.value,
    }, () => this.metronome());
  }

  changeTempo(event) {
    this.setState({
      tempo: event.target.value,
      beatCounter: 0,
    }, () => this.metronome());
  }

  render() {
    const { isPlaying, bars, tempo, beatCounter } = this.state;
    return (
      <div>
        <h1>THE METRONOME</h1>
        <div className="controls">
          <div className="row">
            <div className="title">
              <h2>TEMPO</h2>
              <h2>{tempo}</h2>
            </div>
            <input type="range" value={tempo} min="30" max="290" className="slider" onChange={this.changeTempo} />
          </div>
          <div className="row">
            <div className="title">
              <h2>BARS</h2>
              <h2>{isPlaying ? `${Math.ceil(beatCounter / 4)} / ${bars}` : bars}</h2>
            </div>
            <input type="range" value={bars} min="1" max="30" className="slider" onChange={this.changeBars} />
          </div>
          <div className="row">
            <button className={classnames('playPauseBtn', { stopped: isPlaying })} type="submit" onClick={this.playPauseHandler}>{isPlaying ? 'STOP' : 'PLAY'}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
