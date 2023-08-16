import {Clone} from '../../clone/Clone';
import {Ord} from '../../cmp/Ord';
import {Ordering} from '../../cmp/Ordering';
import {PartialEq} from '../../cmp/PartialEq';
import {PartialOrd} from '../../cmp/PartialOrd';
import {FromIter} from '../../iter/FromIter';
import {IntoIter} from '../../iter/IntoIter';
import {Iter} from '../../iter/Iterator';
import {None, Option, Some} from '../../option/Option';
import {Err, Ok, Result} from '../../result/Result';

export class HashMap<K, V extends PartialEq<V> & PartialOrd<V> & Ord<V>>
  extends FromIter
  implements
    IntoIter<[K, V]>,
    PartialEq<HashMap<K, V>>,
    PartialOrd<HashMap<K, V>>,
    Ord<HashMap<K, V>>,
    Clone<HashMap<K, V>>
{
  private map: Map<K, V> = new Map();

  public keys(): Iter<K> {
    const keys = [...this.map.keys()];
    return new (class Keys extends Iter<K> {
      public next(): Option<K> {
        const next = keys.shift();
        if (next === undefined) return None;
        return Some(<K>next);
      }
    })();
  }

  public values(): Iter<V> {
    const values = [...this.map.values()];
    return new (class Values extends Iter<V> {
      public next(): Option<V> {
        const next = values.shift();
        if (next === undefined) return None;
        return Some(<V>next);
      }
    })();
  }

  public iter(): Iter<[K, V]> {
    const keys = [...this.map.keys()];
    const values = [...this.map.values()];
    return new (class I extends Iter<[K, V]> {
      public next(): Option<[K, V]> {
        const key = keys.shift();
        const value = values.shift();
        if (key === undefined) return None;
        return Some(<[K, V]>[key, value]);
      }
    })();
  }

  public len() {
    return this.map.size;
  }

  public is_empty() {
    return this.len() === 0;
  }

  public drain() {
    const keys = [...this.map.keys()];
    const values = [...this.map.values()];
    this.map.clear();
    return new (class I extends Iter<[K, V]> {
      public next(): Option<[K, V]> {
        const key = keys.shift();
        const value = values.shift();
        if (key === undefined) return None;
        return Some(<[K, V]>[key, value]);
      }
    })();
  }

  public drain_filter<F extends (k: K, v: V) => boolean>(f: F) {
    const self = this;
    const values = [...this.map.values()];
    const pairs = [...this.map.keys()]
      .map((current, idx) => [current, values[idx]])
      .filter(([k, v]) => {
        if (f(<K>k, <V>v)) {
          self.map.delete(<K>k);
          return true;
        }
        return false;
      });
    return new (class I extends Iter<[K, V]> {
      public next(): Option<[K, V]> {
        const pair = pairs.shift();
        if (pair === undefined) return None;
        return Some(<[K, V]>[pair[0], pair[1]]);
      }
    })();
  }

  public retain<F extends (k: K, v: V) => boolean>(f: F) {
    const values = [...this.map.values()];
    [...this.map.keys()]
      .map((current, idx) => [current, values[idx]])
      .forEach(([k, v]) => {
        if (f(<K>k, <V>v)) {
          this.map.delete(<K>k);
          return true;
        }
        return false;
      });
  }

  public clear() {
    this.map.clear();
  }

  public entry(key: K) {
    const self = this;
    return new (class Entry {
      public and_modify<F extends (v: V) => V>(f: F) {
        const value = self.get(key);
        if (value.is_none()) return;
        self.map.set(key, f(value.unwrap()));
      }

      public or_insert(value: V) {
        self.map.set(key, value);
      }
    })();
  }

  public get(k: K): Option<V> {
    if (this.map.has(k)) return Some(<V>this.map.get(k));
    return None;
  }

  public get_key_value(k: K): Option<[K, V]> {
    if (this.map.has(k)) return Some([k, <V>this.map.get(k)]);
    return None;
  }

  public get_many(ks: K[]): Option<V[]> {
    const values: V[] = [];
    for (const k of ks) {
      if (!this.map.has(k)) return None;
      values.push(this.get(k).unwrap());
    }
    return Some(values);
  }

  public contains_key(k: K): boolean {
    return this.map.has(k);
  }

  public insert(k: K, v: V): Option<V> {
    if (this.contains_key(k)) {
      const old_value = this.get(k).unwrap();
      this.map.set(k, v);
      return Some(old_value);
    }
    this.map.set(k, v);
    return None;
  }

  public try_insert(k: K, v: V): Result<V, Error> {
    if (this.contains_key(k))
      return Err(new Error(`This map already contains key: ${k}`));
    this.insert(k, v);
    return Ok(v);
  }

  public remove(k: K): Option<V> {
    if (!this.contains_key(k)) return None;
    const value = this.get(k).unwrap();
    this.map.delete(k);
    return Some(value);
  }

  public remove_entry(k: K): Option<[K, V]> {
    const removed = this.remove(k);
    if (removed.is_none()) return None;
    return Some([k, removed.unwrap()]);
  }

  public static from_iter<
    V extends PartialEq<V> & PartialOrd<V> & Ord<V>,
    T extends [unknown, V]
  >(iter: Iter<T>): HashMap<T[0], T[1]> {
    const hash_map = new HashMap<T[0], T[1]>();
    for (const [key, value] of iter) {
      hash_map.insert(key, value);
    }
    return hash_map;
  }

  public into_iter(): Iter<[K, V]> {
    const values = [...this.map.values()];
    const pairs = [...this.map.keys()].map((current, idx) => [
      current,
      values[idx],
    ]);
    return new (class I extends Iter<[K, V]> {
      public next(): Option<[K, V]> {
        const pair = pairs.shift();
        if (pair === undefined) return None;
        return Some(<[K, V]>[pair[0], pair[1]]);
      }
    })();
  }

  eq(rhs: HashMap<K, V>): boolean {
    if (this.len() !== rhs.len()) return false;
    for (const [key, value] of this.into_iter()) {
      if (!rhs.contains_key(key)) return false;
      if (value.ne(rhs.get(key).unwrap())) return false;
    }
    for (const [key, value] of rhs.into_iter()) {
      if (!this.contains_key(key)) return false;
      if (value.ne(this.get(key).unwrap())) return false;
    }
    return true;
  }

  ne(rhs: HashMap<K, V>): boolean {
    return !this.eq(rhs);
  }

  partial_cmp(rhs: HashMap<K, V>): Option<Ordering> {
    if (this.len() < rhs.len()) return Some(Ordering.Less);
    if (this.len() > rhs.len()) return Some(Ordering.Greater);
    for (const [key, value] of this.into_iter()) {
      if (!rhs.contains_key(key)) return None;
      const cmp = value.cmp(rhs.get(key).unwrap());
      if (cmp !== Ordering.Equal) return Some(cmp);
    }
    for (const [key, value] of rhs.into_iter()) {
      if (!this.contains_key(key)) return None;
      const cmp = value.cmp(this.get(key).unwrap());
      if (cmp !== Ordering.Equal) return Some(cmp);
    }
    return Some(Ordering.Equal);
  }

  cmp(rhs: HashMap<K, V>): Ordering {
    return this.partial_cmp(rhs).unwrap();
  }

  max(rhs: HashMap<K, V>): HashMap<K, V> {
    return this.cmp(rhs) === Ordering.Less ? rhs : this;
  }

  min(rhs: HashMap<K, V>): HashMap<K, V> {
    return this.cmp(rhs) === Ordering.Less ? this : rhs;
  }

  clone(): HashMap<K, V> {
    return HashMap.from_iter(this.into_iter());
  }

  clone_from(source: HashMap<K, V>): void {
    this.clear();
    for (const [key, value] of source.into_iter()) {
      this.insert(key, value);
    }
  }
}
