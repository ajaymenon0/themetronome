import React, { Component } from 'react';

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
    };
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.metronomeObject = '';
    this.minTempo = 30;
    this.maxTempo = 290;
    this.counter = 0;
  }

  onPlayPause() {
    const osc = this.audioCtx.createOscillator();
    const { bars } = this.state;
    osc.type = 'triangle';
    osc.detune.value = this.counter % 4 === 0 ? 1200 : 900;
    this.counter = this.counter + 1;
    osc.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
    if (this.counter >= bars * 4) {
      this.playPauseHandler();
      this.counter = 0;
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
    }, () => this.metronome());
  }

  render() {
    const { isPlaying, bars, tempo } = this.state;
    return (
      <div>
        <h1>Metronomy v1</h1>
        <button type="submit" onClick={this.playPauseHandler}>{isPlaying ? 'STOP' : 'PLAY'}</button>
        <input type="range" value={tempo} min={this.minTempo} max={this.maxTempo} onChange={this.changeTempo} />
        <span>{tempo}</span>
        <input type="range" value={bars} min="1" max="30" onChange={this.changeBars} />
        <span>{bars}</span>
      </div>
    );
  }
}

export default App;
