"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Split = void 0;
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
const Vec_1 = require("../vec/Vec");
class Split extends Iterator_1.Iter {
    constructor(slice, predicate) {
        super();
        this.slice = slice;
        this.predicate = predicate;
    }
    next() {
        const next = this.slice.next();
        if (next.is_none())
            return Option_1.None;
        this.slice = new Vec_1.Vec([next.unwrap(), ...this.slice]);
        const idx = this.slice.position(item => this.predicate(item));
        if (idx.is_none()) {
            return (0, Option_1.Some)(this.finish().flat());
        }
        else {
            return (0, Option_1.Some)(this.slice.drain([0, idx.unwrap()]));
        }
    }
}
exports.Split = Split;
//# sourceMappingURL=Split.js.map