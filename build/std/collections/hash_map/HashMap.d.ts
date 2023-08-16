import { Clone } from '../../clone/Clone';
import { Ord } from '../../cmp/Ord';
import { Ordering } from '../../cmp/Ordering';
import { PartialEq } from '../../cmp/PartialEq';
import { PartialOrd } from '../../cmp/PartialOrd';
import { FromIter } from '../../iter/FromIter';
import { IntoIter } from '../../iter/IntoIter';
import { Iter } from '../../iter/Iterator';
import { Option } from '../../option/Option';
import { Result } from '../../result/Result';
export declare class HashMap<K, V extends PartialEq<V> & PartialOrd<V> & Ord<V>> extends FromIter implements IntoIter<[K, V]>, PartialEq<HashMap<K, V>>, PartialOrd<HashMap<K, V>>, Ord<HashMap<K, V>>, Clone<HashMap<K, V>> {
    private map;
    keys(): Iter<K>;
    values(): Iter<V>;
    iter(): Iter<[K, V]>;
    len(): number;
    is_empty(): boolean;
    drain(): {
        next(): Option<[K, V]>;
        enumerate(): import("../../..").Enumerate<[K, V]>;
        position(predicate: (item: [K, V]) => boolean): Option<number>;
        finish(): [K, V][];
        [Symbol.iterator](): IterableIterator<[K, V]>;
    };
    drain_filter<F extends (k: K, v: V) => boolean>(f: F): {
        next(): Option<[K, V]>;
        enumerate(): import("../../..").Enumerate<[K, V]>;
        position(predicate: (item: [K, V]) => boolean): Option<number>;
        finish(): [K, V][];
        [Symbol.iterator](): IterableIterator<[K, V]>;
    };
    retain<F extends (k: K, v: V) => boolean>(f: F): void;
    clear(): void;
    entry(key: K): {
        and_modify<F extends (v: V) => V>(f: F): void;
        or_insert(value: V): void;
    };
    get(k: K): Option<V>;
    get_key_value(k: K): Option<[K, V]>;
    get_many(ks: K[]): Option<V[]>;
    contains_key(k: K): boolean;
    insert(k: K, v: V): Option<V>;
    try_insert(k: K, v: V): Result<V, Error>;
    remove(k: K): Option<V>;
    remove_entry(k: K): Option<[K, V]>;
    static from_iter<V extends PartialEq<V> & PartialOrd<V> & Ord<V>, T extends [unknown, V]>(iter: Iter<T>): HashMap<T[0], T[1]>;
    into_iter(): Iter<[K, V]>;
    eq(rhs: HashMap<K, V>): boolean;
    ne(rhs: HashMap<K, V>): boolean;
    partial_cmp(rhs: HashMap<K, V>): Option<Ordering>;
    cmp(rhs: HashMap<K, V>): Ordering;
    max(rhs: HashMap<K, V>): HashMap<K, V>;
    min(rhs: HashMap<K, V>): HashMap<K, V>;
    clone(): HashMap<K, V>;
    clone_from(source: HashMap<K, V>): void;
}
