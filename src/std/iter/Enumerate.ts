import {None, Option, Some} from '../option/Option';
import {Iter} from './Iterator';

export class Enumerate<T> extends Iter<[number, T]> {
  private iter: Iter<T>;
  private i = 0;

  public constructor(iter: Iter<T>) {
    super();
    this.iter = iter;
  }

  public next(): Option<[number, T]> {
    const next = this.iter.next();
    return next.is_none() ? None : Some([this.i++, next.unwrap()]);
  }
}
