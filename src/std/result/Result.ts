import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {None, Option, Some} from '../option/Option';

export type Result<T, E> = {
  tag: string;
  is_ok(): boolean;
  is_ok_and(fn: (ok: T) => boolean): boolean;
  is_err(): boolean;
  is_err_and(fn: (err: E) => boolean): boolean;
  unwrap(): T;
  unwrap_or(fallback: T): T;
  unwrap_or_else(op: (err: E) => T): T;
  unwrap_err(): E;
  ok(): Option<T>;
  err(): Option<E>;
  map<U>(fn: (ok: T) => U): Result<U, E>;
  map_or<U>(fallback: U, fn: (ok: T) => U): U;
  map_or_else<U>(fallback: (err: E) => U, fn: (ok: T) => U): U;
  map_err<U>(fn: (err: E) => U): Result<T, U>;
  inspect(fn: (ok: T) => void): Result<T, E>;
  inspect_err(fn: (err: E) => void): Result<T, E>;
  expect(msg: string): T;
  expect_err(msg: string): E;
  and<U>(res: Result<U, E>): Result<U, E>;
  and_then<U>(op: (ok: T) => Result<U, E>): Result<U, E>;
  or(res: Result<T, E>): Result<T, E>;
  or_else<U>(op: (err: E) => U): Result<T, U>;
} & Clone<Result<T, E>> &
  PartialEq<Result<T, E>> &
  PartialOrd<Result<T, E>> &
  Ord<Result<T, E>>;

type Ok<T> = Result<T, never> & {
  tag: 'ok';
  is_ok(): true;
  is_ok_and(fn: (ok: T) => boolean): boolean;
  is_err(): false;
  is_err_and(fn: (err: never) => boolean): boolean;
};

type Err<E> = Result<never, E> & {
  tag: 'ok';
  is_ok(): true;
  is_ok_and(fn: (ok: never) => boolean): boolean;
  is_err(): false;
  is_err_and(fn: (err: E) => boolean): boolean;
};

export function Ok<T>(ok: T): Result<T, never> {
  return {
    tag: 'ok',
    is_ok: () => true,
    is_ok_and: fn => fn(ok),
    is_err: () => false,
    is_err_and: _ => false,
    unwrap: () => ok,
    unwrap_or: _ => ok,
    unwrap_or_else: _ => ok,
    unwrap_err: () => {
      throw new Error('Cannot unwrap Ok type');
    },
    ok: () => Some(ok),
    err: () => None,
    map: fn => Ok(fn(ok)),
    map_or: (_, fn) => fn(ok),
    map_or_else: (_, fn) => fn(ok),
    map_err: _ => Ok(ok),
    inspect: fn => {
      fn(ok);
      return Ok(ok);
    },
    inspect_err: _ => Ok(ok),
    expect: _ => ok,
    expect_err: msg => {
      throw new Error(msg);
    },
    and: res => res,
    and_then: fn => fn(ok),
    or: _ => Ok(ok),
    or_else: _ => Ok(ok),
    clone: () => Ok(ok),
    clone_from: source => {
      if (source.is_err())
        throw new Error('Cannot clone Err type into Ok type');
      ok = source.unwrap();
    },
    eq: rhs => {
      if (rhs.is_err()) return false;
      const unwrapped = rhs.unwrap();
      return ok === unwrapped;
    },
    ne: rhs => {
      if (rhs.is_err()) return true;
      const unwrapped = rhs.unwrap();
      return ok !== unwrapped;
    },
    partial_cmp: rhs => {
      if (rhs.is_err()) return None;
      const unwrapped = rhs.unwrap();
      if (ok < unwrapped) return Some(Ordering.Less);
      if (ok > unwrapped) return Some(Ordering.Greater);
      return Some(Ordering.Equal);
    },
    cmp: rhs => {
      if (rhs.is_err()) return Ordering.Greater;
      return Ok(ok).partial_cmp(rhs).unwrap();
    },
    max: rhs => {
      if (rhs.is_err()) return Ok(ok);
      const cmp = Ok(ok).cmp(rhs);
      if (cmp === Ordering.Less) return rhs;
      return Ok(ok);
    },
    min: rhs => {
      if (rhs.is_err()) return rhs;
      const cmp = Ok(ok).cmp(rhs);
      if (cmp === Ordering.Less) return Ok(ok);
      return rhs;
    },
  };
}

export function Err<E>(err: E): Result<never, E> {
  return {
    tag: 'err',
    is_ok: () => false,
    is_ok_and: _ => false,
    is_err: () => true,
    is_err_and: fn => fn(err),
    unwrap: () => {
      throw new Error('Cannot unwrap Err type');
    },
    unwrap_or: fallback => fallback,
    unwrap_or_else: op => op(err),
    unwrap_err: () => err,
    ok: () => None,
    err: () => Some(err),
    map: _ => Err(err),
    map_or: (fallback, _) => fallback,
    map_or_else: (fallback, _) => fallback(err),
    map_err: fn => Err(fn(err)),
    inspect: _ => Err(err),
    inspect_err: fn => {
      fn(err);
      return Err(err);
    },
    expect: msg => {
      throw new Error(msg);
    },
    expect_err: _ => err,
    and: _ => Err(err),
    and_then: _ => Err(err),
    or: res => {
      if (res.is_err()) return Err(err);
      return res;
    },
    or_else: op => Err(op(err)),
    clone: () => Err(err),
    clone_from: source => {
      if (source.is_ok()) throw new Error('Cannot clone Ok type into Err type');
      err = source.unwrap();
    },
    eq: rhs => {
      if (rhs.is_ok()) return false;
      return err === rhs.err().unwrap();
    },
    ne: rhs => {
      if (rhs.is_ok()) return true;
      return err !== rhs.err().unwrap();
    },
    partial_cmp: rhs => {
      if (rhs.is_ok()) return None;
      const unwrapped = rhs.err().unwrap();
      if (err < unwrapped) return Some(Ordering.Less);
      if (err > unwrapped) return Some(Ordering.Greater);
      return Some(Ordering.Equal);
    },
    cmp: rhs => {
      if (rhs.is_ok()) return Ordering.Less;
      return Err(err).partial_cmp(rhs).unwrap();
    },
    max: rhs => {
      if (rhs.is_ok()) return rhs;
      const cmp = Err(err).cmp(rhs);
      if (cmp === Ordering.Less) return rhs;
      return Err(err);
    },
    min: rhs => {
      if (rhs.is_err()) return Err(err);
      const cmp = Err(err).cmp(rhs);
      if (cmp === Ordering.Less) return Err(err);
      return rhs;
    },
  };
}
