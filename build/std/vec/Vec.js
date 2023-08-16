"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec = void 0;
const Ordering_1 = require("../cmp/Ordering");
const helper_1 = require("../helper");
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
const panic_1 = require("../panic");
const Result_1 = require("../result/Result");
const GroupyBy_1 = require("../slice/GroupyBy");
const Split_1 = require("../slice/Split");
const Windows_1 = require("../slice/Windows");
class Vec extends Iterator_1.Iter {
    constructor(values = []) {
        super();
        this.next_pointer = 0;
        this.vec = [...values];
    }
    truncate(len) {
        this.vec.length = len;
    }
    swap_remove(index) {
        if (index < 0 || index >= this.len())
            (0, panic_1.panic)('Index out of bounds');
        this.swap(index, this.len() - 1);
        return this.vec.pop();
    }
    insert(index, element) {
        if (index > this.len())
            (0, panic_1.panic)('Index out of bounds');
        this.vec.splice(index, 0, element);
    }
    remove(index) {
        if (index < 0 || index >= this.len())
            (0, panic_1.panic)('Index out of bounds');
        return this.vec.splice(index, 1);
    }
    retain(f) {
        this.vec = this.vec.filter(f);
    }
    push(value) {
        this.vec.push(value);
    }
    pop() {
        if (this.len() === 0)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec.pop());
    }
    append(other) {
        for (const element of other.iter()) {
            this.push(element);
        }
    }
    drain(range) {
        const [lower, upper] = range;
        if (lower > upper)
            (0, panic_1.panic)('The lower bound cannot be greater than the upper bound');
        if (upper >= this.len())
            (0, panic_1.panic)('The upper bound is out of range');
        const drained = this.vec.slice(lower, upper);
        for (let i = upper; i > lower; i--)
            this.remove(i);
        return drained;
    }
    clear() {
        this.truncate(0);
    }
    is_empty() {
        return this.len() === 0;
    }
    split_of(at) {
        return this.drain([at, this.len() - 1]);
    }
    extend_from_within(range) {
        const [lower, upper] = range;
        if (lower > upper)
            (0, panic_1.panic)('The lower bound cannot be greater than the upper bound');
        if (upper >= this.len())
            (0, panic_1.panic)('The upper bound is out of range');
        const slice = this.vec.slice(lower, upper);
        this.append(new Vec(slice));
    }
    dedup() {
        this.vec = [...new Set(this.vec)];
    }
    splice(range, replace_with) {
        const [lower, upper] = range;
        if (lower > upper)
            (0, panic_1.panic)('The lower bound cannot be greater than the upper bound');
        if (upper >= this.len())
            (0, panic_1.panic)('The upper bound is out of range');
        const slice = this.vec.slice(lower, upper);
        const left = this.vec.slice(0, lower);
        const right = this.vec.slice(upper);
        this.clear();
        this.vec = [...left, ...replace_with, ...right];
        return slice;
    }
    drain_filter(filter) {
        const retain = [];
        const remove = [];
        this.vec.forEach((t) => (filter(t) ? retain.push(t) : remove.push(t)));
        this.vec = retain;
        return new Vec(remove);
    }
    first() {
        if (this.len() === 0)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec[0]);
    }
    split_first() {
        if (this.len() === 0)
            return Option_1.None;
        const first = this.vec[0];
        const rest = this.vec.slice(1);
        return (0, Option_1.Some)([first, rest]);
    }
    split_last() {
        if (this.len() === 0)
            return Option_1.None;
        const last = this.vec[this.len() - 1];
        const rest = this.vec.slice(0, this.len() - 1);
        return (0, Option_1.Some)([last, rest]);
    }
    last() {
        if (this.len() === 0)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec[this.len() - 1]);
    }
    first_chunk(N) {
        if (this.len() < N)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec.slice(0, N));
    }
    split_first_chunk(N) {
        if (this.len() < N)
            return Option_1.None;
        const chunk = this.vec.slice(0, N);
        const rest = this.vec.slice(N);
        return (0, Option_1.Some)([chunk, rest]);
    }
    split_last_chunk(N) {
        if (this.len() < N)
            return Option_1.None;
        const chunk = this.vec.slice(this.len() - N);
        const rest = this.vec.slice(0, N);
        return (0, Option_1.Some)([chunk, rest]);
    }
    last_chunk(N) {
        if (this.len() < N)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec.slice(this.len() - N));
    }
    get(index) {
        if (index < 0 || index >= this.len())
            return Option_1.None;
        return (0, Option_1.Some)(this.vec[index]);
    }
    swap(a, b) {
        const temp = this.vec[a];
        this.vec[a] = this.vec[b];
        this.vec[b] = temp;
    }
    reverse() {
        this.vec.reverse();
    }
    iter() {
        return [...this.vec];
    }
    windows(size) {
        const windows = [];
        if (!this.is_empty()) {
            for (let i = 0; i < this.len(); i++) {
                this.vec.slice(i, i + size).length === size
                    ? windows.push(this.vec.slice(i, i + size))
                    : void 0;
            }
        }
        return new Windows_1.Windows(windows);
    }
    chunks(chunk_size) {
        const chunks = [];
        for (let i = 0; i <= this.len(); i += chunk_size) {
            chunks.push(this.vec.slice(i, chunk_size));
        }
        return chunks;
    }
    rchunks(chunk_size) {
        const chunks = [];
        const copy = [...this.vec];
        copy.reverse();
        for (let i = 0; i <= this.len(); i += chunk_size) {
            const chunk = this.vec.slice(i, chunk_size);
            chunk.reverse();
            chunks.push(chunk);
        }
        return chunks;
    }
    group_by(pred) {
        return new GroupyBy_1.GroupBy(this, pred);
    }
    split_at(mid) {
        if (mid > this.len())
            (0, panic_1.panic)('mid is out of bounds');
        return [this.vec.slice(0, mid), this.vec.slice(mid)];
    }
    split(pred) {
        return new Split_1.Split(this, pred);
    }
    contains(t) {
        for (const item of this) {
            if (item.eq(t))
                return true;
        }
        return false;
    }
    starts_with(needle) {
        if (needle.len() > this.len())
            return false;
        for (let i = 0; i < needle.len(); i++) {
            const a = this.get(i).unwrap();
            const b = needle.get(i).unwrap();
            if (a.ne(b))
                return false;
        }
        return true;
    }
    ends_with(needle) {
        if (needle.len() > this.len())
            return false;
        for (let i = this.len() - needle.len(); i < this.len(); i++) {
            const a = this.get(i).unwrap();
            const b = needle.get(i).unwrap();
            if (a.ne(b))
                return false;
        }
        return true;
    }
    binary_search(x) {
        let mid = 0;
        let left = 0;
        let right = this.len() - 1;
        while (left < right) {
            mid = (left + right) >> 2;
            const item = this.get(mid).unwrap();
            switch (item.cmp(x)) {
                case Ordering_1.Ordering.Equal: {
                    return (0, Result_1.Ok)(mid);
                }
                case Ordering_1.Ordering.Greater: {
                    right = mid - 1;
                    break;
                }
                case Ordering_1.Ordering.Less: {
                    left = mid + 1;
                    break;
                }
            }
        }
        return (0, Result_1.Err)(mid);
    }
    sort_unstable() {
        this.vec.sort((a, b) => a.cmp(b));
    }
    rotate_left(mid) {
        const values = [...this.vec];
        for (let i = 0; i < this.len(); i++) {
            this.vec[(i - mid) % this.len()] = values[i];
        }
    }
    rotate_right(mid) {
        const values = [...this.vec];
        for (let i = 0; i < this.len(); i++) {
            this.vec[(i + mid) % this.len()] = values[i];
        }
    }
    fill(value) {
        this.vec = Array(this.len()).fill(value);
    }
    fill_with(f) {
        this.vec = Array(this.len()).fill(f());
    }
    is_sorted() {
        const windows = this.windows(2);
        for (const [a, b] of windows) {
            const cmp = a.cmp(b);
            if (cmp === Ordering_1.Ordering.Greater)
                return false;
        }
        return true;
    }
    sort() {
        this.vec = (0, helper_1.merge_sort)(this.vec);
    }
    repeat(n) {
        const copy = [...this.vec];
        return new Vec(Array(n).fill(copy));
    }
    len() {
        return this.vec.length;
    }
    next() {
        if (this.len() === 0 || this.next_pointer === this.len()) {
            this.next_pointer = 0;
            return Option_1.None;
        }
        const head = this.vec[this.next_pointer];
        this.next_pointer++;
        return (0, Option_1.Some)(head);
    }
    clone() {
        return new Vec(this.vec);
    }
    clone_from(source) {
        this.vec = [...source.clone().iter()];
    }
    eq(rhs) {
        if (this.len() !== rhs.len())
            return false;
        for (let i = 0; i < this.len(); i++) {
            const a = this.get(i).unwrap();
            const b = rhs.get(i).unwrap();
            if (!a.eq(b))
                return false;
        }
        return true;
    }
    ne(rhs) {
        return !this.eq(rhs);
    }
    partial_cmp(rhs) {
        if (this.eq(rhs))
            return (0, Option_1.Some)(Ordering_1.Ordering.Equal);
        if (this.len() > rhs.len())
            return (0, Option_1.Some)(Ordering_1.Ordering.Greater);
        else
            return (0, Option_1.Some)(Ordering_1.Ordering.Less);
    }
    cmp(rhs) {
        return this.partial_cmp(rhs).unwrap();
    }
    max(rhs) {
        return this.cmp(rhs) === Ordering_1.Ordering.Greater ? this : rhs;
    }
    min(rhs) {
        return this.cmp(rhs) === Ordering_1.Ordering.Greater ? rhs : this;
    }
}
exports.Vec = Vec;
//# sourceMappingURL=Vec.js.map