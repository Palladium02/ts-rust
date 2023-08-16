import { Clone } from '../clone/Clone';
import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
export declare type Option<T> = {
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
    zip_with<U extends Clone<U>, R extends Clone<R>>(other: Option<U>, fn: (t: T, u: U) => R): Option<R>;
} & Clone<Option<T>> & PartialEq<Option<T>> & PartialOrd<Option<T>> & Ord<Option<T>>;
declare type Some<T> = Option<T> & {
    tag: 'some';
    is_some(): true;
    is_none(): false;
};
declare type None = Option<never> & {
    tag: 'none';
    is_some(): false;
    is_none(): true;
};
export declare const None: None;
export declare function Some<T>(value: T): Some<T>;
export {};
