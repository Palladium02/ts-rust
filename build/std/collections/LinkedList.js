"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedList = void 0;
const Ordering_1 = require("../cmp/Ordering");
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
const panic_1 = require("../panic");
class LinkedList {
    constructor() {
        this.head = Option_1.None;
        this.tail = Option_1.None;
        this.length = 0;
    }
    append(other) {
        let node = other.pop_front();
        while (node.is_some()) {
            this.length++;
            this.push_back(node.unwrap());
            node = other.pop_front();
        }
    }
    is_empty() {
        return this.head.is_none();
    }
    len() {
        return this.length;
    }
    clear() {
        this.length = 0;
        this.head = Option_1.None;
    }
    contains(x) {
        let next = this.head;
        while (next.is_some()) {
            if (next.unwrap().get_value().eq(x))
                return true;
            next = next.unwrap().get_next();
        }
        return false;
    }
    front() {
        return this.head.is_some() ? (0, Option_1.Some)(this.head.unwrap().get_value()) : Option_1.None;
    }
    back() {
        return this.tail.is_some() ? (0, Option_1.Some)(this.tail.unwrap().get_value()) : Option_1.None;
    }
    push_front(elt) {
        const node = new LinkedNode(elt);
        this.length++;
        if (this.head.is_none()) {
            this.head = (0, Option_1.Some)(node);
            this.tail = (0, Option_1.Some)(node);
        }
        else {
            const old_head = this.head;
            node.set_next(old_head);
            this.head = (0, Option_1.Some)(node);
        }
    }
    pop_front() {
        if (this.head.is_none())
            return Option_1.None;
        const new_head = this.head.unwrap().get_next();
        const value = this.head.unwrap().get_value();
        this.head = new_head;
        if (this.head.is_none())
            this.tail = Option_1.None;
        this.length--;
        return (0, Option_1.Some)(value);
    }
    push_back(elt) {
        const node = new LinkedNode(elt);
        this.length++;
        if (this.head.is_none()) {
            this.head = (0, Option_1.Some)(node);
            this.tail = (0, Option_1.Some)(node);
        }
        else {
            const old_tail = this.tail;
            node.set_previous(old_tail);
            this.tail = (0, Option_1.Some)(node);
        }
    }
    pop_back() {
        if (this.tail.is_none())
            return Option_1.None;
        const new_tail = this.tail.unwrap().get_previous();
        const value = this.tail.unwrap().get_value();
        this.tail = new_tail;
        if (this.tail.is_none())
            this.head = Option_1.None;
        this.length--;
        return (0, Option_1.Some)(value);
    }
    split_off(at) {
        if (at > this.len())
            (0, panic_1.panic)('Index out of bounds');
        let node = this.head;
        for (let i = 0; i < at; i++) {
            node = node.unwrap().get_next();
        }
        this.tail = node.unwrap().get_previous();
        this.length = this.len() - at;
        const new_list = new LinkedList();
        while (node.is_some()) {
            new_list.push_back(node.unwrap().get_value());
            node = node.unwrap().get_next();
        }
        return new_list;
    }
    remove(at) {
        if (at > this.len())
            (0, panic_1.panic)('Index out of bounds');
        let node = this.head;
        for (let i = 0; i < at; i++) {
            node = node.unwrap().get_next();
        }
        const next = node.unwrap().get_next();
        const previous = node.unwrap().get_previous();
        previous.unwrap().set_next(next);
        if (next.is_none())
            this.tail = previous;
    }
    drain_filter(f) {
        const self = this;
        return new (class DrainFilter extends Iterator_1.Iter {
            constructor() {
                super();
                this.next_pointer = 0;
                this.values = [];
                let node = self.head;
                while (node.is_some()) {
                    this.values.push(node.unwrap().get_value());
                    node = node.unwrap().get_next();
                }
                this.values = this.values.filter(f);
            }
            next() {
                if (this.values.length === 0 ||
                    this.next_pointer === this.values.length) {
                    this.next_pointer = 0;
                    return Option_1.None;
                }
                const head = this.values[this.next_pointer];
                this.next_pointer++;
                return (0, Option_1.Some)(head);
            }
        })();
    }
    eq(rhs) {
        if (this.len() !== rhs.len())
            return false;
        let self_node = this.head;
        let rhs_node = rhs.head;
        while (self_node.is_some()) {
            if (self_node.unwrap().get_value().ne(rhs_node.unwrap().get_value()))
                return false;
            self_node = self_node.unwrap().get_next();
            rhs_node = rhs_node.unwrap().get_next();
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
            return (0, Option_1.Some)(Ordering_1.Ordering.Less);
        let self_node = this.head;
        let rhs_node = rhs.head;
        while (self_node.is_some()) {
            const cmp = self_node
                .unwrap()
                .get_value()
                .cmp(rhs_node.unwrap().get_value());
            if (cmp === Ordering_1.Ordering.Less)
                return (0, Option_1.Some)(Ordering_1.Ordering.Less);
            if (cmp === Ordering_1.Ordering.Greater)
                return (0, Option_1.Some)(Ordering_1.Ordering.Greater);
            self_node = self_node.unwrap().get_next();
            rhs_node = rhs_node.unwrap().get_next();
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
    static from_iter(iter) {
        const linked_list = new LinkedList();
        for (const item of iter) {
            linked_list.push_back(item);
        }
        return linked_list;
    }
}
exports.LinkedList = LinkedList;
class LinkedNode {
    constructor(value, previous = Option_1.None) {
        this.next = Option_1.None;
        this.value = value;
        this.previous = previous;
    }
    get_previous() {
        return this.previous;
    }
    set_previous(node) {
        this.previous = node;
    }
    get_next() {
        return this.next;
    }
    set_next(node) {
        this.next = node;
    }
    get_value() {
        return this.value;
    }
}
//# sourceMappingURL=LinkedList.js.map