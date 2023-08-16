"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iter = void 0;
const Option_1 = require("../option/Option");
const Enumerate_1 = require("./Enumerate");
class Iter {
    *[Symbol.iterator]() {
        let next = this.next();
        while (next.is_some()) {
            yield next.unwrap();
            next = this.next();
        }
    }
    enumerate() {
        return new Enumerate_1.Enumerate(this);
    }
    position(predicate) {
        for (const [index, item] of this.enumerate()) {
            if (predicate(item))
                return (0, Option_1.Some)(index);
        }
        return Option_1.None;
    }
    finish() {
        const rest = [];
        let next = this.next();
        while (next.is_some()) {
            rest.push(next.unwrap());
            next = this.next();
        }
        return rest;
    }
}
exports.Iter = Iter;
//# sourceMappingURL=Iterator.js.map