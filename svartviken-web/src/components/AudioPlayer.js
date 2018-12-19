import React from 'react'
import { Howl } from 'howler'
import styled from 'styled-components'
import { isNumber } from 'util'
import 'wired-elements'

const SeekBar = styled.div`
  float: left;
  width: 650px;
  position: relative;
  height: 96px;
  font-size: 9px;
  background: #2e2e2e;
  color: rgba(255, 255, 255, 0.88);
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
`

const RightPane = styled.div`
  float: right;
  width: 530px;

  .icon {
    font-size: 13px;
    margin: 5px;
  }
`

const Title = styled.h1`
  font-size: 18px;
  font-weight: 300;
  margin: 10px auto;

  color: rgba(255, 255, 255, 0.88);
`

const Description = styled.h6`
  font-size: 14px;

  color: rgba(255, 255, 255, 0.88);
  font-weight: 300;
  top: 45px;
  left: 125px;
  font-style: normal;
  margin: 5px auto;
`

const AudioCover = styled.div`
  float: left;
  height: 96px;
  width: 96px;
  background: black;
`

const ForwardButton = styled.button`
  float: right;
`

const BackwardButton = styled.button`
  float: right;
`

const MainButton = styled.button`
  float: right;
`

const Time = styled.div`
  float: left;
  font-size: 9px;
  z-index: 2;
  margin: 7px 5px;
`

const ProgressPointer = styled.div`
  border-radius: 100%;
  background: pink;
  height: 8px;
  width: 8px;
  transform: translateY(-2.5px);
  left: ${props => props.progress + '%'};
  top: -3px;
  position: absolute;
`

const ProgressWrapper = styled.div`
  z-index: 0;
  float: left;
  position: relative;
  cursor: pointer;
  width: 280px;
  margin: 15px auto;
  border-top: 3px rgba(255, 255, 255, 0.2) solid;
  height: 10px;
`

const Progress = styled.div`
  position: absolute;
  top: -3px;
  background: grey;
  z-index: 1;
  width: ${props => props.progress + '%'};
  height: 3px;
`

const minutes = time => Math.floor(time / 60)
const seconds = (time, minutes) => Math.floor(time - minutes * 60)

const str_pad_left = (string, pad, length) =>
  (new Array(length + 1).join(pad) + string).slice(-length)

const formatTime = time => {
  const m = minutes(time)
  const s = seconds(time, m)

  return str_pad_left(m, '0', 2) + ':' + str_pad_left(s, '0', 2)
}

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.audio = new Howl({
      src: [props.src],
      html5: true,
      onload: () => {
        this.setState({ duration: formatTime(this.audio.duration()) })
      },
    })

    this.state = {
      playing: false,
      time: '00:00',
      progress: 0,
      duration: formatTime(this.audio.duration()),
      seeking: false,
      seekBarMouseDown: false,
    }

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.forward = this.forward.bind(this)
    this.backward = this.backward.bind(this)
    this.step = this.step.bind(this)
    this.seek = this.seek.bind(this)
    this.seekOnMouseDown = this.seekOnMouseDown.bind(this)
    this.getSeekValueFromMouseEvent = this.getSeekValueFromMouseEvent.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentWillMount() {
    document.addEventListener('mousemove', this.handleMouseMove, false)
    document.addEventListener('mouseup', this.handleMouseUp, false)
  }

  componentWillUnmount() {
    document.addEventListener('mousemove', this.handleMouseMove, false)
    document.addEventListener('mouseup', this.handleMouseUp, false)
  }

  play() {
    this.audio.play()
    window.requestAnimationFrame(this.step)
    this.setState((state, props) => ({
      playing: true,
      duration: formatTime(this.audio.duration()),
    }))
  }

  pause() {
    this.setState({ playing: false })
    this.audio.pause()
  }

  forward() {
    const seek = this.audio.seek() || 0
    const value =
      seek + 30 < this.audio.duration() ? seek + 30 : this.audio.duration()

    this.seek(value)
  }

  backward() {
    const seek = this.audio.seek() || 0
    const value = seek - 30 > 0 ? seek - 30 : 0

    this.seek(value)
  }

  seek(value) {
    this.audio.seek(value)
    window.requestAnimationFrame(this.step)
  }

  step() {
    const seek = this.audio.seek() || 0

    if (!isNaN(seek)) {
      const time = formatTime(seek)
      const progress = (seek / this.audio.duration()) * 100

      this.setState({
        time,
        progress,
      })
    }

    if (this.state.playing) {
      window.requestAnimationFrame(this.step)
    }
  }

  getSeekValueFromMouseEvent(screenX) {
    const boundingClientRect = this.state.progressRect.getBoundingClientRect()
    const currentPos = screenX - boundingClientRect.x
    const maxPos = boundingClientRect.right - boundingClientRect.x
    const percentage = currentPos / maxPos
    return this.audio.duration() * percentage
  }

  seekOnMouseDown(event) {
    event.persist()
    console.log(event)
    this.setState(
      {
        seekBarMouseDown: true,
        progressRect: event.currentTarget,
      },
      () => this.seek(this.getSeekValueFromMouseEvent(event.clientX))
    )
  }

  handleMouseMove(event) {
    if (this.state.seekBarMouseDown) {
      this.seek(this.getSeekValueFromMouseEvent(event.clientX))
    }
  }

  handleMouseUp() {
    this.setState({ seekBarMouseDown: false })
  }

  render() {
    return (
      <div className="sviken-audio-player">
        <SeekBar>
          <AudioCover>
            <img src={this.props.cover} />
          </AudioCover>
          <RightPane>
            <Title>{this.props.title}</Title>
            <Description>{this.props.description}</Description>

            <span onClick={this.backward} className="icon">
              <i className="fas fa-undo" />
            </span>

            {this.state.playing ? (
              <span onClick={this.pause} className="icon">
                <i className="fas fa-pause-circle" />
              </span>
            ) : (
              <span onClick={this.play} className="icon">
                <i className="fas fa-play-circle" />
              </span>
            )}

            <span onClick={this.forward} className="icon">
              <i className="fas fa-redo" />
            </span>
            <ProgressWrapper onMouseDown={this.seekOnMouseDown}>
              <Progress progress={this.state.progress}>&nbsp;</Progress>

              <ProgressPointer progress={this.state.progress}>
                &nbsp;
              </ProgressPointer>
            </ProgressWrapper>
            <Time>
              {this.state.time} / {this.state.duration}
            </Time>
          </RightPane>
        </SeekBar>
      </div>
    )
  }
}

export default AudioPlayer
