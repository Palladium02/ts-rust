import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {panic} from '../panic';
import {Err, Ok, Result} from '../result/Result';

export class VecDeque<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>
  extends Iter<T>
  implements
    Clone<VecDeque<T>>,
    PartialEq<VecDeque<T>>,
    PartialOrd<VecDeque<T>>,
    Ord<VecDeque<T>>
{
  private vec: T[];

  public constructor(values: Iterable<T> = []) {
    super();
    this.vec = [...values];
  }

  public get(index: number): Option<T> {
    const item = this.vec[index];
    return item === undefined ? None : Some(item);
  }

  public swap(a: number, b: number) {
    const temp = this.vec[a];
    this.vec[a] = this.vec[b];
    this.vec[b] = temp;
  }

  public truncate(len: number) {
    this.vec.length = len;
  }

  public len() {
    return this.vec.length;
  }

  public is_empty() {
    return this.len() === 0;
  }

  public range<R extends [number, number]>(range: R): Iter<T> {
    const [lower, upper] = range;
    if (lower > upper || upper > this.len()) panic('Range is out of bounds');
    const slice = this.vec.slice(lower, upper);
    return new (class Range extends Iter<T> {
      private slice: T[];
      private next_pointer = 0;

      public constructor(slice: T[]) {
        super();
        this.slice = slice;
      }

      public next(): Option<T> {
        if (
          this.slice.length === 0 ||
          this.next_pointer === this.slice.length
        ) {
          this.next_pointer = 0;
          return None;
        }
        const head = this.slice[this.next_pointer];
        this.next_pointer++;
        return Some(head);
      }
    })(slice);
  }

  public drain<R extends [number, number]>(range: R) {
    const [lower, upper] = range;
    if (lower > upper)
      panic('The lower bound cannot be greater than the upper bound');
    if (upper >= this.len()) panic('The upper bound is out of range');
    const drained = this.vec.slice(lower, upper);
    for (let i = upper; i > lower; i--) this.remove(i);
    return drained;
  }

  public clear() {
    this.truncate(0);
  }

  public contains(t: T): boolean {
    for (const item of this) {
      if (item.eq(t)) return true;
    }
    return false;
  }

  public front(): Option<T> {
    if (this.len() === 0) return None;
    return Some(this.vec[0]);
  }

  public back(): Option<T> {
    if (this.len() === 0) return None;
    return Some(this.vec[this.len() - 1]);
  }

  public pop_front(): Option<T> {
    if (this.len() === 0) return None;
    const [front] = this.vec.splice(0, 1);
    return Some(front);
  }

  public pop_back(): Option<T> {
    if (this.len() === 0) return None;
    const back = <T>this.vec.pop();
    return Some(back);
  }

  public push_front(value: T) {
    this.vec = [value, ...this.vec];
  }

  public push_back(value: T) {
    this.vec.push(value);
  }

  public swap_remove_front(index: number) {
    if (index < 0 || index > this.len() - 1) return None;
    this.swap(0, index);
    return this.pop_front();
  }

  public swap_remove_back(index: number) {
    if (index < 0 || index > this.len() - 1) return None;
    this.swap(0, index);
    return this.pop_back();
  }

  public insert(index: number, value: T) {
    if (index > this.len()) panic('Index out of bounds');
    this.vec.splice(index, 0, value);
  }

  public remove(index: number) {
    if (index < 0 || index >= this.len()) panic('Index out of bounds');
    return Some(<T>(<unknown>this.vec.splice(index, 1)));
  }

  public split_of(at: number) {
    if (at > this.len()) panic('Index out of bounds');
    const right = this.vec.splice(at, this.len() - at);
    return new VecDeque(right);
  }

  public append(other: VecDeque<T>) {
    const length = other.len();
    for (let i = 0; i < length; i++) {
      this.push_back(other.pop_front().unwrap());
    }
  }

  public retain<F extends (t: T) => boolean>(f: F) {
    this.vec = this.vec.filter(f);
  }

  public rotate_left(mid: number) {
    const values = [...this.vec];
    for (let i = 0; i < this.len(); i++) {
      this.vec[(i - mid) % this.len()] = values[i];
    }
  }

  public rotate_right(mid: number) {
    const values = [...this.vec];
    for (let i = 0; i < this.len(); i++) {
      this.vec[(i + mid) % this.len()] = values[i];
    }
  }

  public binary_search(x: T): Result<number, number> {
    let mid = 0;
    let left = 0;
    let right = this.len() - 1;
    while (left < right) {
      mid = (left + right) >> 2;
      const item = this.get(mid).unwrap();
      switch (item.cmp(x)) {
        case Ordering.Equal: {
          return Ok(mid);
        }
        case Ordering.Greater: {
          right = mid - 1;
          break;
        }
        case Ordering.Less: {
          left = mid + 1;
          break;
        }
      }
    }
    return Err(mid);
  }

  public next(): Option<T> {
    throw new Error('Method not implemented.');
  }

  clone(): VecDeque<T> {
    return new VecDeque<T>(this.vec);
  }

  clone_from(source: VecDeque<T>): void {
    this.vec = [...source.clone()];
  }

  eq(rhs: VecDeque<T>): boolean {
    if (this.len() !== rhs.len()) return false;
    for (let i = 0; i < this.len(); i++) {
      const a = this.get(i).unwrap();
      const b = rhs.get(i).unwrap();
      if (!a.eq(b)) return false;
    }
    return true;
  }

  ne(rhs: VecDeque<T>): boolean {
    return !this.eq(rhs);
  }

  partial_cmp(rhs: VecDeque<T>): Option<Ordering> {
    if (this.eq(rhs)) return Some(Ordering.Equal);
    if (this.len() > rhs.len()) return Some(Ordering.Greater);
    else return Some(Ordering.Less);
  }

  cmp(rhs: VecDeque<T>): Ordering {
    return this.partial_cmp(rhs).unwrap();
  }

  max(rhs: VecDeque<T>): VecDeque<T> {
    return this.cmp(rhs) === Ordering.Greater ? this : rhs;
  }

  min(rhs: VecDeque<T>): VecDeque<T> {
    return this.cmp(rhs) === Ordering.Greater ? rhs : this;
  }
}
