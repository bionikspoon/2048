/* global describe, it */
import { List, fromJS } from 'immutable';
import { shift, transpose, shiftLeft, shiftUp, shiftRight, shiftDown, createTile } from './core';
import { expect } from 'chai';
import { placeholderFactory } from './utils';

const U = undefined;

describe('app core logic', () => {
  describe('shift', () => {
    it('shifts a number to the left', () => {
      const a = placeholderFactory(2);
      const state = List.of(U, U, a, U);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(a, U, U, U));
    });

    it('shifts all numbers to the left', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = List.of(U, a, U, b);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(a, b, U, U));
    });

    it('combines like numbers', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(2),
      ];
      const state = List.of(a, b, U, U);
      const nextState = shift(state);
      expect(nextState).to.equal(List.of(b.merge({ value: 4 }), U, U, U));
    });

    it('combines like numbers even when separated', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(2),
      ];
      const state = List.of(a, U, b, U);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(b.merge({ value: 4 }), U, U, U));
    });

    it('does not aggressively combine numbers', () => {
      const [a, b, c] = [
        placeholderFactory(2),
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = List.of(a, b, c, U);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(b.merge({ value: 4 }), c, U, U));
    });

    it('combines pairs', () => {
      const [a, b, c, d] = [
        placeholderFactory(2),
        placeholderFactory(2),
        placeholderFactory(2),
        placeholderFactory(2),
      ];
      const [_b, _d] = [
        b.merge({ value: 4 }),
        d.merge({ value: 4 }),
      ];
      const state = List.of(a, b, c, d);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(_b, _d, U, U));
    });

    it('combines pairs with different values', () => {
      const [a, b, c, d] = [
        placeholderFactory(2),
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const [_b, _d] = [
        b.merge({ value: 4 }),
        d.merge({ value: 8 }),
      ];
      const state = List.of(a, b, c, d);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(_b, _d, U, U));
    });

    it('handles empty values', () => {
      const state = List.of(U, U, U, U);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(U, U, U, U));
    });

    it('finds seperated pairs', () => {
      const [a, b, c] = [
        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const _b = b.merge({ value: 8 });
      const state = List.of(a, U, b, c);
      const nextState = shift(state);

      expect(nextState).to.equal(List.of(_b, c, U, U));
    });
  });

  describe('transpose', () => {
    const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = [
      placeholderFactory(2),
      placeholderFactory(4),
      placeholderFactory(8),
      placeholderFactory(16),

      placeholderFactory(32),
      placeholderFactory(64),
      placeholderFactory(128),
      placeholderFactory(256),

      placeholderFactory(512),
      placeholderFactory(1024),
      placeholderFactory(2048),
      placeholderFactory(3),

      placeholderFactory(5),
      placeholderFactory(7),
      placeholderFactory(9),
      placeholderFactory(11),
    ];
    it('gets columns from a list of rows', () => {
      const state = fromJS([  // :off
        [a, b, c, d],
        [e, f, g, h],
        [i, j, k, l],
        [m, n, o, p],
      ]);  // :on
      const nextState = transpose(state);

      expect(nextState).to.equal(fromJS([  // :off
        [a, e, i, m],
        [b, f, j, n],
        [c, g, k, o],
        [d, h, l, p],
      ]));  // :on
    });

    it('has some sanity', () => {
      const state = fromJS([  // :off
        [a, b, c, d],
        [e, f, g, h],
        [i, j, k, l],
        [m, n, o, p],
      ]);  // :on

      const nextState = transpose(transpose(state));
      expect(nextState).to.equal(state);

      const oddState = transpose(transpose(transpose(state)));
      expect(oddState).to.equal(transpose(state));
    });

    it('can handle undefined values', () => {
      const [q, r] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, q],
        [U, U, r, U],
        [U, U, U, U],
      ]);  // :on

      const nextState = transpose(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, U, U],
        [U, U, U, U],
        [U, U, r, U],
        [U, q, U, U],
      ]));  // :on

      expect(transpose(nextState)).to.equal(state);
    });
  });

  describe('shiftLeft', () => {
    it('shifts values left', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on

      const nextState = shiftLeft(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, U, U],
        [a, U, U, U],
        [b, U, U, U],
        [U, U, U, U],
      ]));  // :on
    });

    it('shifts values left', () => {
      const [a, b, c, d, e, f, g, h, i, j, k, l] = [
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),

        placeholderFactory(8),
        placeholderFactory(8),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(2),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const [C, E, G, J, L] = [
        c.merge({ value: 8 }),
        e.merge({ value: 16 }),
        g.merge({ value: 8 }),
        j.merge({ value: 8 }),
        l.merge({ value: 8 }),
      ];
      const state = fromJS([  // :off
        [a, b, c, U],
        [U, U, d, e],
        [U, f, g, h],
        [i, j, k, l],
      ]);  // :on

      const nextState = shiftLeft(state);

      expect(nextState).to.equal(fromJS([  // :off
        [a, C, U, U],
        [E, U, U, U],
        [G, h, U, U],
        [J, L, U, U],
      ]));  // :on
    });
  });

  describe('shiftUp', () => {
    it('shifts values up', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on

      const nextState = shiftUp(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, b, a],
        [U, U, U, U],
        [U, U, U, U],
        [U, U, U, U],
      ]));  // :on
    });

    it('shifts values up', () => {
      const [a, b, c, d, e, f, g, h, i, j, k, l] = [
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),

        placeholderFactory(8),
        placeholderFactory(8),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(2),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const [F, K] = [
        f.merge({ value: 8 }),
        k.merge({ value: 8 }),
      ];
      const state = fromJS([  // :off
        [a, b, c, U],
        [U, U, d, e],
        [U, f, g, h],
        [i, j, k, l],
      ]);  // :on

      const nextState = shiftUp(state);

      expect(nextState).to.equal(fromJS([  // :off
        [a, F, c, e],
        [i, j, d, h],
        [U, U, K, l],
        [U, U, U, U],
      ]));  // :on
    });
  });

  describe('shiftRight', () => {
    it('shifts values right', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on

      const nextState = shiftRight(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, U, b],
        [U, U, U, U],
      ]));  // :on
    });

    it('shifts values right', () => {
      const [a, b, c, d, e, f, g, h, i, j, k, l] = [
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),

        placeholderFactory(8),
        placeholderFactory(8),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(2),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const [B, D, F, I, K] = [
        b.merge({ value: 8 }),
        d.merge({ value: 16 }),
        f.merge({ value: 8 }),
        i.merge({ value: 8 }),
        k.merge({ value: 8 }),
      ];
      const state = fromJS([  // :off
        [a, b, c, U],
        [U, U, d, e],
        [U, f, g, h],
        [i, j, k, l],
      ]);  // :on

      const nextState = shiftRight(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, a, B],
        [U, U, U, D],
        [U, U, F, h],
        [U, U, I, K],
      ]));  // :on
    });
  });

  describe('shiftDown', () => {
    it('shifts values down', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on

      const nextState = shiftDown(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, U, U],
        [U, U, U, U],
        [U, U, U, U],
        [U, U, b, a],
      ]));  // :on
    });

    it('shifts values down', () => {
      const [a, b, c, d, e, f, g, h, i, j, k, l] = [
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),

        placeholderFactory(8),
        placeholderFactory(8),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(2),

        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const [F, G] = [
        f.merge({ value: 8 }),
        g.merge({ value: 8 }),
      ];
      const state = fromJS([  // :off
        [a, b, c, U],
        [U, U, d, e],
        [U, f, g, h],
        [i, j, k, l],
      ]);  // :on

      const nextState = shiftDown(state);

      expect(nextState).to.equal(fromJS([  // :off
        [U, U, U, U],
        [U, U, c, e],
        [a, b, d, h],
        [i, F, G, l],
      ]));  // :on
    });
  });

  describe('createTile', () => {
    it('creates a tile at coordinates', () => {
      const [a, b] = [
        placeholderFactory(2),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [U, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on
      const c = placeholderFactory(2);
      const tile = c.merge({
        row: 0,
        col: 0,
      });
      const nextState = createTile(state, tile);

      expect(nextState).to.equal(fromJS([  // :off
        [c, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]));  // :on
    });

    it('does not override existing tiles', () => {
      const [a, b, c] = [
        placeholderFactory(2),
        placeholderFactory(4),
        placeholderFactory(4),
      ];
      const state = fromJS([  // :off
        [c, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]);  // :on
      const d = placeholderFactory(2);
      const tile = d.merge({
        row: 0,
        col: 0,
      });
      const nextState = createTile(state, tile);

      expect(nextState).to.equal(fromJS([  // :off
        [c, U, U, U],
        [U, U, U, a],
        [U, U, b, U],
        [U, U, U, U],
      ]));  // :on
    });
  });
});
