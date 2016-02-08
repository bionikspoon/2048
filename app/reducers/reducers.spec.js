/* global describe, it */
import { expect } from 'chai';
import { fromJS } from 'immutable';
import { onShiftDown, onShiftLeft, onShiftUp, onShiftRight, onCreateTile } from '../actionCreators';
import reducer from './reducers';
import { placeholderFactory } from '../core/utils';
const U = undefined; // eslint-disable-line id-length

describe('reducer', () => {
  const [a, b] = [
    placeholderFactory(2),
    placeholderFactory(4),
  ];
  describe('SHIFT_LEFT', () => {
    it('handles SHIFT_LEFT', () => {
      const initialState = fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ],  // :on
        },
      });
      const nextState = reducer(initialState, onShiftLeft());

      expect(nextState).to.equal(fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [a, U, U, U],
            [b, U, U, U],
            [U, U, U, U],
          ], // :on
        },
      }));
    });
  });

  describe('SHIFT_RIGHT', () => {
    it('handles SHIFT_RIGHT', () => {
      const initialState = fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ],  // :on
        },
      });
      const nextState = reducer(initialState, onShiftRight());

      expect(nextState).to.equal(fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, U, b],
            [U, U, U, U],
          ], // :on
        },
      }));
    });
  });

  describe('SHIFT_DOWN', () => {
    it('handles SHIFT_DOWN', () => {
      const initialState = fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ],  // :on
        },
      });
      const nextState = reducer(initialState, onShiftDown());

      expect(nextState).to.equal(fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, U],
            [U, U, U, U],
            [U, U, b, a],
          ], // :on
        },
      }));
    });
  });

  describe('SHIFT_UP', () => {
    it('handles SHIFT_UP', () => {
      const initialState = fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ],  // :on
        },
      });
      const nextState = reducer(initialState, onShiftUp());

      expect(nextState).to.equal(fromJS({
        game: {
          status: [  // :off
            [U, U, b, a],
            [U, U, U, U],
            [U, U, U, U],
            [U, U, U, U],
          ], // :on
        },
      }));
    });
  });

  describe('CREATE_TILE', () => {
    it('handles CREATE_TILE', () => {
      const c = placeholderFactory(2);
      const tile = c.merge({
        row: 0,
        col: 0,
      }).toJS();
      const initialState = fromJS({
        game: {
          status: [  // :off
            [U, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ],  // :on
        },
      });
      const nextState = reducer(initialState, onCreateTile(tile.value, tile.col, tile.row, tile.id));

      expect(nextState).to.equal(fromJS({
        game: {
          status: [  // :off
            [c, U, U, U],
            [U, U, U, a],
            [U, U, b, U],
            [U, U, U, U],
          ], // :on
        },
      }));
    });
  });
});
