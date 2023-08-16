import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';

export type Option<T> = {
  tag: string;
  is_some(): boolean;
  is_none(): boolean;
  expect(msg: string): T;
  unwrap(): T;
  unwrap_or(fallback: T): T;
  unwrap_or_else(fn: () => T): T;
  map<U extends Clone<U>>(fn: (value: T) => U): Option<U>;
  inspect(fn: (value: T) => void): Option<T>;
  map_or<U>(fallback: U, fn: (value: T) => U): U;
  map_or_else<U>(fallback: () => U, fn: (value: T) => U): U;
  and<U extends Clone<U>>(optb: Option<U>): Option<U>;
  and_then<U extends Clone<U>>(fn: (value: T) => Option<U>): Option<U>;
  filter(predicate: (value: T) => boolean): Option<T>;
  or(optb: Option<T>): Option<T>;
  or_else(fn: () => Option<T>): Option<T>;
  xor(optb: Option<T>): Option<T>;
  zip<U extends Clone<U>>(other: Option<U>): Option<[T, U]>;
  zip_with<U extends Clone<U>, R extends Clone<R>>(
    other: Option<U>,
    fn: (t: T, u: U) => R
  ): Option<R>;
} & Clone<Option<T>> &
  PartialEq<Option<T>> &
  PartialOrd<Option<T>> &
  Ord<Option<T>>;

type Some<T> = Option<T> & {
  tag: 'some';
  is_some(): true;
  is_none(): false;
};

type None = Option<never> & {
  tag: 'none';
  is_some(): false;
  is_none(): true;
};

export const None: None = {
  tag: 'none',
  is_some: () => false,
  is_none: () => true,
  expect: msg => {
    throw new Error(msg);
  },
  unwrap: () => {
    throw new Error('');
  },
  unwrap_or: fallback => fallback,
  unwrap_or_else: fn => fn(),
  map: _ => None,
  inspect: () => None,
  map_or: (fallback, _) => fallback,
  map_or_else: (fallback, _) => fallback(),
  and: _ => None,
  and_then: _ => None,
  filter: () => None,
  or: optb => optb,
  or_else: fn => fn(),
  xor: optb => {
    if (optb.is_some()) return optb;
    return None;
  },
  zip: _ => None,
  zip_with: (_, __) => None,
  clone: () => None,
  clone_from: _ => {
    throw new Error('Cannot clone into None type');
  },
  eq: rhs => {
    return !rhs.is_some();
  },
  ne: rhs => {
    return rhs.is_some();
  },
  partial_cmp(rhs) {
    if (rhs.is_some()) return None;
    return Some(Ordering.Equal);
  },
  cmp(rhs) {
    if (rhs.is_none()) return Ordering.Equal;
    return Ordering.Less;
  },
  max(rhs) {
    return rhs;
  },
  min(rhs) {
    return None;
  },
};

export function Some<T>(value: T): Some<T> {
  return {
    tag: 'some',
    is_some: () => true,
    is_none: () => false,
    expect: () => value,
    unwrap: () => value,
    unwrap_or: _ => value,
    unwrap_or_else: _ => value,
    map: fn => Some(fn(value)),
    inspect: fn => {
      fn(value);
      return Some(value);
    },
    map_or: (_, fn) => fn(value),
    map_or_else: (_, fn) => fn(value),
    and: optb => optb,
    and_then: fn => fn(value),
    filter: predicate => (predicate(value) ? Some(value) : None),
    or: _ => Some(value),
    or_else: _ => Some(value),
    xor: optb => {
      if (optb.is_some()) return None;
      return Some(value);
    },
    zip: other => (other.is_none() ? None : Some([value, other.unwrap()])),
    zip_with: (other, fn) =>
      other.is_none() ? None : Some(fn(value, other.unwrap())),
    clone: () => Some(value),
    clone_from: source => {
      if (source.is_none())
        throw new Error('Cannot copy None type into Some type');
      value = source.unwrap();
    },
    eq: rhs => {
      if (rhs.is_none()) return false;
      const unwrapped = rhs.unwrap();
      return unwrapped === value;
    },
    ne: rhs => {
      if (rhs.is_none()) return true;
      const unwrapped = rhs.unwrap();
      return unwrapped !== value;
    },
    partial_cmp(rhs) {
      if (rhs.is_none()) return None;
      const unwrapped = rhs.unwrap();
      if (unwrapped > value) return Some(Ordering.Less);
      if (unwrapped < value) return Some(Ordering.Greater);
      return Some(Ordering.Equal);
    },
    cmp(rhs) {
      if (rhs.is_none()) return Ordering.Greater;
      const unwrapped = rhs.unwrap();
      if (unwrapped > value) return Ordering.Less;
      if (unwrapped < value) return Ordering.Greater;
      return Ordering.Equal;
    },
    max(rhs) {
      if (rhs.is_none()) return Some(value);
      const unwrapped = rhs.unwrap();
      if (unwrapped > value) return rhs;
      if (unwrapped < value) return Some(value);
      return rhs;
    },
    min(rhs) {
      if (rhs.is_none()) return Some(value);
      const unwrapped = rhs.unwrap();
      if (unwrapped < value) return rhs;
      if (unwrapped > value) return Some(value);
      return rhs;
    },
  };
}
