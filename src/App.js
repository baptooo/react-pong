import React, {Component} from 'react';
import Track, {TRACK_HEIGHT, TRACK_WIDTH} from './components/Track';
import Ball, {BALL_RADIUS} from './components/Ball';
import * as constants from './constants';

const difficulties = [
  constants.DIFFICULTY_EASY,
  constants.DIFFICULTY_MEDIUM,
  constants.DIFFICULTY_HARD,
  constants.DIFFICULTY_INSANE,
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: {x: 0, y: props.height / 2},
      computer: {x: props.width - TRACK_WIDTH, y: props.height / 2},
      ball: {x: props.width / 2, y: props.height / 2},
      speed: {x: 5, y: 0},
      score: {computer: 0, player: 0},
      startTime: Date.now(),
      elapsedTime: 0,
      finished: false,
      difficulty: null,
    }
  }

  componentDidMount() {
    window.onmousemove = ({pageY}) => this.setState({player: {y: pageY}});
  }

  calculateSpeed(track, ball) {
    const ratio = (ball.y - track.y) / (TRACK_HEIGHT / 2);
    return ratio * 10;
  }

  gameFrame() {
    const {width, height} = this.props;
    let {ball, speed, player, computer, score, startTime, elapsedTime, difficulty} = this.state;
    elapsedTime = Date.now() - startTime;

    // Move ball
    ball.x += speed.x;
    ball.y += speed.y;

    const hitsPlayer = ball.x < (TRACK_WIDTH + BALL_RADIUS / 2) && Math.abs(ball.y - player.y) < TRACK_HEIGHT / 2;
    const hitsComputer = ball.x > (width - TRACK_WIDTH - BALL_RADIUS / 2) && (Math.abs(ball.y - computer.y) < TRACK_HEIGHT / 2);
    // Progressive handicap on 500ms threshold
    const computerHandicap = Number((Math.sin(elapsedTime / 500) + 1) * difficulty.strength).toFixed(3);

    computer.y = computer.y + (ball.y - computer.y) * computerHandicap;

    if (hitsPlayer || hitsComputer) {
      if (hitsPlayer) {
        speed.y = this.calculateSpeed(player, ball);
      }
      if (hitsComputer) {
        speed.y = this.calculateSpeed(computer, ball);
      }
      speed.x = Math.max(-10, Math.min(10, -speed.x * 1.1));
    }

    if (ball.x < 0 || ball.x > width) {
      if (speed.x < 0) {
        score.computer++;
      } else {
        score.player++;
      }
      ball = {x: width / 2, y: height / 2};
    }

    if (ball.y < 0 || ball.y > height) speed.y = -speed.y;

    this.setState({ball, speed, player, computer, score, elapsedTime});

    if ([score.computer, score.player].includes(10)) {
      this.setState({finished: true});
    } else {
      this.nextFrame();
    }
  }

  nextFrame() {
    requestAnimationFrame(() => this.gameFrame());
  }

  start(difficulty) {
    this.setState({difficulty});
    this.nextFrame();
  }

  render() {
    const {width, height} = this.props;
    const {player, computer, ball, score, finished, difficulty} = this.state;

    return (
      <section>
        <h1>react-pong</h1>
        {difficulty ? (
          <div>
            {!finished ? (
              <div>
                <svg width={width} height={height}>
                  <Track {...player} />
                  <Ball {...ball} />
                  <Track {...computer} />
                </svg>
                <strong>Playing in <span style={{color: difficulty.color}}>{difficulty.label}</span> mode</strong>
                <p>First dude going to 10 wins</p>
                <h2>Human: {score.player} — Computer: {score.computer}</h2>
              </div>
            ) : (
              <h2>{score.player > score.computer ? difficulty.win : difficulty.loose}</h2>
            )}
          </div>
        ) : (
          <div>
            <h2>Choose your level</h2>
            <ul>
              {difficulties.map(difficulty => (
                <li key={difficulty.label} style={{backgroundColor: difficulty.color}}>
                  <h3>{difficulty.label}</h3>
                  <p>{difficulty.description}</p>
                  <button role="button" onClick={() => this.start(difficulty)}>Go !</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }
}

export default App;
