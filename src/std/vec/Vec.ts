import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {merge_sort} from '../helper';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {panic} from '../panic';
import {Err, Ok, Result} from '../result/Result';
import {GroupBy} from '../slice/GroupyBy';
import {Split} from '../slice/Split';
import {Windows} from '../slice/Windows';
import {Tuple} from '../types';

export class Vec<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>
  extends Iter<T>
  implements Clone<Vec<T>>, PartialEq<Vec<T>>, PartialOrd<Vec<T>>, Ord<Vec<T>>
{
  private vec: T[];
  private next_pointer = 0;

  public constructor(values: Iterable<T> = []) {
    super();
    this.vec = [...values];
  }

  public truncate(len: number) {
    this.vec.length = len;
  }

  public swap_remove(index: number) {
    if (index < 0 || index >= this.len()) panic('Index out of bounds');

    this.swap(index, this.len() - 1);
    return this.vec.pop();
  }

  public insert(index: number, element: T) {
    if (index > this.len()) panic('Index out of bounds');
    this.vec.splice(index, 0, element);
  }

  public remove(index: number) {
    if (index < 0 || index >= this.len()) panic('Index out of bounds');
    return <T>(<unknown>this.vec.splice(index, 1));
  }

  public retain(f: (t: T) => boolean) {
    this.vec = this.vec.filter(f);
  }

  public push(value: T) {
    this.vec.push(value);
  }

  public pop(): Option<T> {
    if (this.len() === 0) return None;
    return Some(this.vec.pop()!);
  }

  public append(other: Vec<T>) {
    for (const element of other.iter()) {
      this.push(element);
    }
  }

  public drain(range: [number, number]) {
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

  public is_empty() {
    return this.len() === 0;
  }

  public split_of(at: number) {
    return this.drain([at, this.len() - 1]);
  }

  public extend_from_within(range: [number, number]) {
    const [lower, upper] = range;
    if (lower > upper)
      panic('The lower bound cannot be greater than the upper bound');
    if (upper >= this.len()) panic('The upper bound is out of range');
    const slice = this.vec.slice(lower, upper);
    this.append(new Vec(slice));
  }

  public dedup() {
    this.vec = [...new Set(this.vec)];
  }

  public splice(range: [number, number], replace_with: Iterable<T>) {
    const [lower, upper] = range;
    if (lower > upper)
      panic('The lower bound cannot be greater than the upper bound');
    if (upper >= this.len()) panic('The upper bound is out of range');
    const slice = this.vec.slice(lower, upper);
    const left = this.vec.slice(0, lower);
    const right = this.vec.slice(upper);
    this.clear();
    this.vec = [...left, ...replace_with, ...right];
    return slice;
  }

  public drain_filter(filter: (t: T) => boolean) {
    const retain: T[] = [];
    const remove: T[] = [];
    this.vec.forEach((t: T) => (filter(t) ? retain.push(t) : remove.push(t)));
    this.vec = retain;
    return new Vec(remove);
  }

  public first(): Option<T> {
    if (this.len() === 0) return None;
    return Some(this.vec[0]);
  }

  public split_first(): Option<[T, T[]]> {
    if (this.len() === 0) return None;
    const first = this.vec[0];
    const rest = this.vec.slice(1);
    return Some([first, rest]);
  }

  public split_last(): Option<[T, T[]]> {
    if (this.len() === 0) return None;
    const last = this.vec[this.len() - 1];
    const rest = this.vec.slice(0, this.len() - 1);
    return Some([last, rest]);
  }

  public last(): Option<T> {
    if (this.len() === 0) return None;
    return Some(this.vec[this.len() - 1]);
  }

  public first_chunk<N extends number>(N: N): Option<Tuple<T, typeof N>> {
    if (this.len() < N) return None;
    return Some(this.vec.slice(0, N)) as Option<Tuple<T, typeof N>>;
  }

  public split_first_chunk<N extends number>(
    N: N
  ): Option<[Tuple<T, typeof N>, T[]]> {
    if (this.len() < N) return None;
    const chunk = this.vec.slice(0, N);
    const rest = this.vec.slice(N);
    return Some([chunk, rest]) as Option<[Tuple<T, typeof N>, T[]]>;
  }

  public split_last_chunk<N extends number>(
    N: N
  ): Option<[Tuple<T, typeof N>, T[]]> {
    if (this.len() < N) return None;
    const chunk = this.vec.slice(this.len() - N);
    const rest = this.vec.slice(0, N);
    return Some([chunk, rest]) as Option<[Tuple<T, typeof N>, T[]]>;
  }

  public last_chunk<N extends number>(N: N): Option<Tuple<T, typeof N>> {
    if (this.len() < N) return None;
    return Some(this.vec.slice(this.len() - N)) as Option<Tuple<T, typeof N>>;
  }

  public get(index: number): Option<T> {
    if (index < 0 || index >= this.len()) return None;
    return Some(this.vec[index]);
  }

  public swap(a: number, b: number) {
    const temp = this.vec[a];
    this.vec[a] = this.vec[b];
    this.vec[b] = temp;
  }

  public reverse() {
    this.vec.reverse();
  }

  public iter(): Iterable<T> {
    return [...this.vec];
  }

  public windows<N extends number>(size: N): Windows<Tuple<T, N>> {
    const windows: Tuple<T, N>[] = [];
    if (!this.is_empty()) {
      for (let i = 0; i < this.len(); i++) {
        this.vec.slice(i, i + size).length === size
          ? windows.push(this.vec.slice(i, i + size) as Tuple<T, N>)
          : void 0;
      }
    }
    return new Windows(windows);
  }

  public chunks<N extends number>(chunk_size: N): Tuple<T, N>[] {
    const chunks: Tuple<T, N>[] = [];

    for (let i = 0; i <= this.len(); i += chunk_size) {
      chunks.push(this.vec.slice(i, chunk_size) as Tuple<T, N>);
    }

    return chunks;
  }

  public rchunks<N extends number>(chunk_size: N): Tuple<T, N>[] {
    const chunks: Tuple<T, N>[] = [];

    const copy = [...this.vec];
    copy.reverse();

    for (let i = 0; i <= this.len(); i += chunk_size) {
      const chunk = this.vec.slice(i, chunk_size) as Tuple<T, N>;
      chunk.reverse();
      chunks.push(chunk);
    }

    return chunks;
  }

  public group_by(pred: (t: T, u: T) => boolean): GroupBy<T, typeof pred> {
    return new GroupBy(this, pred);
  }

  public split_at(mid: number): [T[], T[]] {
    if (mid > this.len()) panic('mid is out of bounds');
    return [this.vec.slice(0, mid), this.vec.slice(mid)];
  }

  public split(pred: (t: T) => boolean) {
    return new Split(this, pred);
  }

  public contains(t: T): boolean {
    for (const item of this) {
      if (item.eq(t)) return true;
    }
    return false;
  }

  public starts_with(needle: Vec<T>): boolean {
    if (needle.len() > this.len()) return false;
    for (let i = 0; i < needle.len(); i++) {
      const a = this.get(i).unwrap();
      const b = needle.get(i).unwrap();
      if (a.ne(b)) return false;
    }
    return true;
  }

  public ends_with(needle: Vec<T>): boolean {
    if (needle.len() > this.len()) return false;
    for (let i = this.len() - needle.len(); i < this.len(); i++) {
      const a = this.get(i).unwrap();
      const b = needle.get(i).unwrap();
      if (a.ne(b)) return false;
    }
    return true;
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

  public sort_unstable() {
    this.vec.sort((a, b) => a.cmp(b));
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

  public fill(value: T) {
    this.vec = Array(this.len()).fill(value);
  }

  public fill_with(f: () => T) {
    this.vec = Array(this.len()).fill(f());
  }

  public is_sorted(): boolean {
    const windows = this.windows(2);
    for (const [a, b] of windows) {
      const cmp = a.cmp(b);
      if (cmp === Ordering.Greater) return false;
    }
    return true;
  }

  public sort() {
    this.vec = merge_sort(this.vec);
  }

  public repeat(n: number): Vec<T> {
    const copy = [...this.vec];
    return new Vec(Array(n).fill(copy));
  }

  public len() {
    return this.vec.length;
  }

  public next() {
    if (this.len() === 0 || this.next_pointer === this.len()) {
      this.next_pointer = 0;
      return None;
    }
    const head = this.vec[this.next_pointer];
    this.next_pointer++;
    return Some(head);
  }

  clone(): Vec<T> {
    return new Vec<T>(this.vec);
  }

  clone_from(source: Vec<T>): void {
    this.vec = [...source.clone().iter()];
  }

  eq(rhs: Vec<T>): boolean {
    if (this.len() !== rhs.len()) return false;
    for (let i = 0; i < this.len(); i++) {
      const a = this.get(i).unwrap();
      const b = rhs.get(i).unwrap();
      if (!a.eq(b)) return false;
    }
    return true;
  }

  ne(rhs: Vec<T>): boolean {
    return !this.eq(rhs);
  }

  partial_cmp(rhs: Vec<T>): Option<Ordering> {
    if (this.eq(rhs)) return Some(Ordering.Equal);
    if (this.len() > rhs.len()) return Some(Ordering.Greater);
    else return Some(Ordering.Less);
  }

  cmp(rhs: Vec<T>): Ordering {
    return this.partial_cmp(rhs).unwrap();
  }

  max(rhs: Vec<T>): Vec<T> {
    return this.cmp(rhs) === Ordering.Greater ? this : rhs;
  }

  min(rhs: Vec<T>): Vec<T> {
    return this.cmp(rhs) === Ordering.Greater ? rhs : this;
  }
}
