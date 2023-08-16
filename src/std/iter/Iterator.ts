import {None, Option, Some} from '../option/Option';
import {Enumerate} from './Enumerate';

export abstract class Iter<T> {
  public abstract next(): Option<T>;

  *[Symbol.iterator](): IterableIterator<T> {
    let next = this.next();
    while (next.is_some()) {
      yield next.unwrap();
      next = this.next();
    }
  }

  public enumerate(): Enumerate<T> {
    return new Enumerate(this);
  }

  public position(predicate: (item: T) => boolean): Option<number> {
    for (const [index, item] of this.enumerate()) {
      if (predicate(item)) return Some(index);
    }
    return None;
  }

  public finish(): T[] {
    const rest: T[] = [];
    let next = this.next();
    while (next.is_some()) {
      rest.push(next.unwrap());
      next = this.next();
    }
    return rest;
  }
}
