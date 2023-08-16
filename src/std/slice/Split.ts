import {Ord} from '../cmp/Ord';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {Vec} from '../vec/Vec';

export class Split<
  T extends PartialEq<T> & PartialOrd<T> & Ord<T>,
  P extends (t: T) => boolean
> extends Iter<T[]> {
  private slice: Vec<T>;
  private predicate: P;

  public constructor(slice: Vec<T>, predicate: P) {
    super();
    this.slice = slice;
    this.predicate = predicate;
  }

  public next(): Option<T[]> {
    const next = this.slice.next();
    if (next.is_none()) return None;
    this.slice = new Vec([next.unwrap(), ...this.slice]);
    const idx = this.slice.position(item => this.predicate(item));
    if (idx.is_none()) {
      return Some(this.finish().flat());
    } else {
      return Some(this.slice.drain([0, idx.unwrap()]));
    }
  }
}
