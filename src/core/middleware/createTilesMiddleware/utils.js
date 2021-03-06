import _ from 'lodash';
import { handleCreateTiles } from '../../modules/game';
export function createRandomTileAction(gameState, quantity = 1) {
  // get empty tiles
  const emptyTiles = gameState.getEmptyTiles().toJS();

  // Guard, no empty tiles
  if (!emptyTiles.length) {
    return undefined;
  }

  // choose random tiles from the grid
  const randomTileSample = _.sampleSize(emptyTiles, Math.min(quantity, emptyTiles.length));

  // create tiles
  const newTiles = randomTileSample.map(tile => (
    _.merge(tile, { value: randomTileValue() })
  ));

  return handleCreateTiles(newTiles);
}

function randomTileValue() {
  const random = Math.random();
  if (random >= 0.95) {return 8;}

  if (random >= 0.70) {return 4;}

  return 2;
}

export function randomTileQuantity() {
  return Math.random() > 0.75 ? 3 : 2;
}
