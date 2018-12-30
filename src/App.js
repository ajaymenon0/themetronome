import React, { Component } from 'react'

class App extends Component {
  constructor(props){
    super(props)
    this.onPlayPause = this.onPlayPause.bind(this)
    this.metronome = this.metronome.bind(this)
    this.playPauseHandler = this.playPauseHandler.bind(this)
    this.changeTempo = this.changeTempo.bind(this)
    this.changeBars = this.changeBars.bind(this)
    this.state = {
      isPlaying: false,
      tempo: 60,
      bars: 2
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioCtx = new AudioContext()
    this.metronomeObject = ''
    this.minTempo = 30
    this.maxTempo = 290
    this.counter = 0
  }

  metronome(){
    if(this.state.isPlaying){
      clearInterval(this.metronomeObject)
      this.metronomeObject = setInterval(() =>{ this.onPlayPause()}, (60/this.state.tempo)*1000)
    }
    else
      clearInterval(this.metronomeObject)
  }


  playPauseHandler(){
    this.setState({ isPlaying: !this.state.isPlaying } , () => this.metronome())
  }
  
  onPlayPause(){
    let osc = this.audioCtx.createOscillator()
    osc.type = 'triangle'
    osc.detune.value = this.counter++%4==0? 1200:900
    osc.connect(this.audioCtx.destination)
    osc.start()
    osc.stop(this.audioCtx.currentTime + 0.05)
    if(this.counter >= this.state.bars*4) this.playPauseHandler()
  }

  changeBars(event){
    this.setState({
      bars: event.target.value
    }, () => this.metronome())
  }

  changeTempo(event){
    this.setState({
      tempo: event.target.value
    }, () => this.metronome())
  }

  render(){
    return(
      <div>
        <h1>Metronomy v1</h1>
        <button onClick={this.playPauseHandler} >{this.state.isPlaying?'STOP':'PLAY'}</button>
        <input type="range" value={this.state.tempo} min={this.minTempo} max={this.maxTempo} onChange={this.changeTempo} />
        <label>{this.state.tempo}</label>
        <input type="range" value={this.state.bars} min="1" max="30" onChange={this.changeBars} />
        <label>{this.state.bars}</label>
      </div>
    )
  }
}

export default App;