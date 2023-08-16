import {Iter} from './Iterator';

export abstract class FromIter {
  static from_iter(iter: Iter<unknown>): unknown {
    throw new Error('Not implemented');
  }
}
