import {Ord} from '../cmp/Ord';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {Vec} from '../vec/Vec';

export class GroupBy<
  T extends PartialEq<T> & PartialOrd<T> & Ord<T>,
  P extends (t: T, u: T) => boolean
> extends Iter<GroupBy<T, P>> {
  private slice: Vec<T>;
  private pred: P;

  public constructor(slice: Vec<T>, pred: P) {
    super();
    this.slice = slice;
    this.pred = pred;
  }

  public next(): Option<GroupBy<T, P>> {
    if (this.slice.is_empty()) return None;
    let len = 1;
    const iter = this.slice.windows(2);
    let next = iter.next();
    while (next.is_some()) {
      const [l, r] = next.unwrap();
      if (this.pred(l, r)) {
        len++;
        next = iter.next();
      } else {
        break;
      }
    }
    const [head, tail] = this.slice.split_at(len);
    this.slice = new Vec(tail);
    return Some(new GroupBy(new Vec(head), this.pred));
  }
}
