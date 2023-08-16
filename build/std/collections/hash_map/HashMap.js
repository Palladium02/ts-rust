"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashMap = void 0;
const Ordering_1 = require("../../cmp/Ordering");
const FromIter_1 = require("../../iter/FromIter");
const Iterator_1 = require("../../iter/Iterator");
const Option_1 = require("../../option/Option");
const Result_1 = require("../../result/Result");
class HashMap extends FromIter_1.FromIter {
    constructor() {
        super(...arguments);
        this.map = new Map();
    }
    keys() {
        const keys = [...this.map.keys()];
        return new (class Keys extends Iterator_1.Iter {
            next() {
                const next = keys.shift();
                if (next === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)(next);
            }
        })();
    }
    values() {
        const values = [...this.map.values()];
        return new (class Values extends Iterator_1.Iter {
            next() {
                const next = values.shift();
                if (next === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)(next);
            }
        })();
    }
    iter() {
        const keys = [...this.map.keys()];
        const values = [...this.map.values()];
        return new (class I extends Iterator_1.Iter {
            next() {
                const key = keys.shift();
                const value = values.shift();
                if (key === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)([key, value]);
            }
        })();
    }
    len() {
        return this.map.size;
    }
    is_empty() {
        return this.len() === 0;
    }
    drain() {
        const keys = [...this.map.keys()];
        const values = [...this.map.values()];
        this.map.clear();
        return new (class I extends Iterator_1.Iter {
            next() {
                const key = keys.shift();
                const value = values.shift();
                if (key === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)([key, value]);
            }
        })();
    }
    drain_filter(f) {
        const self = this;
        const values = [...this.map.values()];
        const pairs = [...this.map.keys()]
            .map((current, idx) => [current, values[idx]])
            .filter(([k, v]) => {
            if (f(k, v)) {
                self.map.delete(k);
                return true;
            }
            return false;
        });
        return new (class I extends Iterator_1.Iter {
            next() {
                const pair = pairs.shift();
                if (pair === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)([pair[0], pair[1]]);
            }
        })();
    }
    retain(f) {
        const values = [...this.map.values()];
        [...this.map.keys()]
            .map((current, idx) => [current, values[idx]])
            .forEach(([k, v]) => {
            if (f(k, v)) {
                this.map.delete(k);
                return true;
            }
            return false;
        });
    }
    clear() {
        this.map.clear();
    }
    entry(key) {
        const self = this;
        return new (class Entry {
            and_modify(f) {
                const value = self.get(key);
                if (value.is_none())
                    return;
                self.map.set(key, f(value.unwrap()));
            }
            or_insert(value) {
                self.map.set(key, value);
            }
        })();
    }
    get(k) {
        if (this.map.has(k))
            return (0, Option_1.Some)(this.map.get(k));
        return Option_1.None;
    }
    get_key_value(k) {
        if (this.map.has(k))
            return (0, Option_1.Some)([k, this.map.get(k)]);
        return Option_1.None;
    }
    get_many(ks) {
        const values = [];
        for (const k of ks) {
            if (!this.map.has(k))
                return Option_1.None;
            values.push(this.get(k).unwrap());
        }
        return (0, Option_1.Some)(values);
    }
    contains_key(k) {
        return this.map.has(k);
    }
    insert(k, v) {
        if (this.contains_key(k)) {
            const old_value = this.get(k).unwrap();
            this.map.set(k, v);
            return (0, Option_1.Some)(old_value);
        }
        this.map.set(k, v);
        return Option_1.None;
    }
    try_insert(k, v) {
        if (this.contains_key(k))
            return (0, Result_1.Err)(new Error(`This map already contains key: ${k}`));
        this.insert(k, v);
        return (0, Result_1.Ok)(v);
    }
    remove(k) {
        if (!this.contains_key(k))
            return Option_1.None;
        const value = this.get(k).unwrap();
        this.map.delete(k);
        return (0, Option_1.Some)(value);
    }
    remove_entry(k) {
        const removed = this.remove(k);
        if (removed.is_none())
            return Option_1.None;
        return (0, Option_1.Some)([k, removed.unwrap()]);
    }
    static from_iter(iter) {
        const hash_map = new HashMap();
        for (const [key, value] of iter) {
            hash_map.insert(key, value);
        }
        return hash_map;
    }
    into_iter() {
        const values = [...this.map.values()];
        const pairs = [...this.map.keys()].map((current, idx) => [
            current,
            values[idx],
        ]);
        return new (class I extends Iterator_1.Iter {
            next() {
                const pair = pairs.shift();
                if (pair === undefined)
                    return Option_1.None;
                return (0, Option_1.Some)([pair[0], pair[1]]);
            }
        })();
    }
    eq(rhs) {
        if (this.len() !== rhs.len())
            return false;
        for (const [key, value] of this.into_iter()) {
            if (!rhs.contains_key(key))
                return false;
            if (value.ne(rhs.get(key).unwrap()))
                return false;
        }
        for (const [key, value] of rhs.into_iter()) {
            if (!this.contains_key(key))
                return false;
            if (value.ne(this.get(key).unwrap()))
                return false;
        }
        return true;
    }
    ne(rhs) {
        return !this.eq(rhs);
    }
    partial_cmp(rhs) {
        if (this.len() < rhs.len())
            return (0, Option_1.Some)(Ordering_1.Ordering.Less);
        if (this.len() > rhs.len())
            return (0, Option_1.Some)(Ordering_1.Ordering.Greater);
        for (const [key, value] of this.into_iter()) {
            if (!rhs.contains_key(key))
                return Option_1.None;
            const cmp = value.cmp(rhs.get(key).unwrap());
            if (cmp !== Ordering_1.Ordering.Equal)
                return (0, Option_1.Some)(cmp);
        }
        for (const [key, value] of rhs.into_iter()) {
            if (!this.contains_key(key))
                return Option_1.None;
            const cmp = value.cmp(this.get(key).unwrap());
            if (cmp !== Ordering_1.Ordering.Equal)
                return (0, Option_1.Some)(cmp);
        }
        return (0, Option_1.Some)(Ordering_1.Ordering.Equal);
    }
    cmp(rhs) {
        return this.partial_cmp(rhs).unwrap();
    }
    max(rhs) {
        return this.cmp(rhs) === Ordering_1.Ordering.Less ? rhs : this;
    }
    min(rhs) {
        return this.cmp(rhs) === Ordering_1.Ordering.Less ? this : rhs;
    }
    clone() {
        return HashMap.from_iter(this.into_iter());
    }
    clone_from(source) {
        this.clear();
        for (const [key, value] of source.into_iter()) {
            this.insert(key, value);
        }
    }
}
exports.HashMap = HashMap;
//# sourceMappingURL=HashMap.js.map