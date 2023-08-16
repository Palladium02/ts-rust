"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VecDeque = void 0;
const Ordering_1 = require("../cmp/Ordering");
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
const panic_1 = require("../panic");
const Result_1 = require("../result/Result");
class VecDeque extends Iterator_1.Iter {
    constructor(values = []) {
        super();
        this.vec = [...values];
    }
    get(index) {
        const item = this.vec[index];
        return item === undefined ? Option_1.None : (0, Option_1.Some)(item);
    }
    swap(a, b) {
        const temp = this.vec[a];
        this.vec[a] = this.vec[b];
        this.vec[b] = temp;
    }
    truncate(len) {
        this.vec.length = len;
    }
    len() {
        return this.vec.length;
    }
    is_empty() {
        return this.len() === 0;
    }
    range(range) {
        const [lower, upper] = range;
        if (lower > upper || upper > this.len())
            (0, panic_1.panic)('Range is out of bounds');
        const slice = this.vec.slice(lower, upper);
        return new (class Range extends Iterator_1.Iter {
            constructor(slice) {
                super();
                this.next_pointer = 0;
                this.slice = slice;
            }
            next() {
                if (this.slice.length === 0 ||
                    this.next_pointer === this.slice.length) {
                    this.next_pointer = 0;
                    return Option_1.None;
                }
                const head = this.slice[this.next_pointer];
                this.next_pointer++;
                return (0, Option_1.Some)(head);
            }
        })(slice);
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
    contains(t) {
        for (const item of this) {
            if (item.eq(t))
                return true;
        }
        return false;
    }
    front() {
        if (this.len() === 0)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec[0]);
    }
    back() {
        if (this.len() === 0)
            return Option_1.None;
        return (0, Option_1.Some)(this.vec[this.len() - 1]);
    }
    pop_front() {
        if (this.len() === 0)
            return Option_1.None;
        const [front] = this.vec.splice(0, 1);
        return (0, Option_1.Some)(front);
    }
    pop_back() {
        if (this.len() === 0)
            return Option_1.None;
        const back = this.vec.pop();
        return (0, Option_1.Some)(back);
    }
    push_front(value) {
        this.vec = [value, ...this.vec];
    }
    push_back(value) {
        this.vec.push(value);
    }
    swap_remove_front(index) {
        if (index < 0 || index > this.len() - 1)
            return Option_1.None;
        this.swap(0, index);
        return this.pop_front();
    }
    swap_remove_back(index) {
        if (index < 0 || index > this.len() - 1)
            return Option_1.None;
        this.swap(0, index);
        return this.pop_back();
    }
    insert(index, value) {
        if (index > this.len())
            (0, panic_1.panic)('Index out of bounds');
        this.vec.splice(index, 0, value);
    }
    remove(index) {
        if (index < 0 || index >= this.len())
            (0, panic_1.panic)('Index out of bounds');
        return (0, Option_1.Some)(this.vec.splice(index, 1));
    }
    split_of(at) {
        if (at > this.len())
            (0, panic_1.panic)('Index out of bounds');
        const right = this.vec.splice(at, this.len() - at);
        return new VecDeque(right);
    }
    append(other) {
        const length = other.len();
        for (let i = 0; i < length; i++) {
            this.push_back(other.pop_front().unwrap());
        }
    }
    retain(f) {
        this.vec = this.vec.filter(f);
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
    next() {
        throw new Error('Method not implemented.');
    }
    clone() {
        return new VecDeque(this.vec);
    }
    clone_from(source) {
        this.vec = [...source.clone()];
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
exports.VecDeque = VecDeque;
//# sourceMappingURL=VecDeque.js.map