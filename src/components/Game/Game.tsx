///<reference path="../../app.d.ts"/>

import * as React from 'react';
const { PropTypes } = React;
import * as ImmutablePropTypes from 'react-immutable-proptypes';
import { PureComponent } from '../../lib/PureComponent';

import { GameGrid } from './GameGrid';
import { GameTiles } from './GameTiles';

export class Game extends PureComponent {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.keymap = {
      [37]: this.props.actions.handleShiftLeft,
      [38]: this.props.actions.handleShiftUp,
      [39]: this.props.actions.handleShiftRight,
      [40]: this.props.actions.handleShiftDown,
    };
  }

  static propTypes = {
    actions: PropTypes.shape({
      handleShiftLeft: PropTypes.func.isRequired,
      handleShiftRight: PropTypes.func.isRequired,
      handleShiftDown: PropTypes.func.isRequired,
      handleShiftUp: PropTypes.func.isRequired,
      handleNewGame: PropTypes.func.isRequired,
    }),

    value: PropTypes.number.isRequired,

    tiles: ImmutablePropTypes.setOf(ImmutablePropTypes.map).isRequired,
  };

  render() {
    const { handleShiftLeft, handleShiftRight, handleShiftUp, handleShiftDown, handleNewGame } = this.props.actions;
    const { tiles } = this.props;

    return (
      <div>
        <p className="buttons">
          <button onClick={handleShiftLeft}>Left</button>
          <button onClick={handleShiftRight}>Right</button>
          <button onClick={handleShiftDown}>Down</button>
          <button onClick={handleShiftUp}>Up</button>
        </p>

        <p>
          <button
            className="new-game"
            onClick={handleNewGame}
          >New Game
          </button>
        </p>

        <div className="game">
          <GameGrid />

          <GameTiles tiles={tiles}/>

        </div>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillMount() {
    // this.props.actions.handleNewGame();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown(event) {
    const handler = this.keymap[ event.keyCode ];

    if (!handler) { return undefined;}

    event.preventDefault();
    handler(event);
  }
}