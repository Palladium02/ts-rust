"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupBy = void 0;
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
const Vec_1 = require("../vec/Vec");
class GroupBy extends Iterator_1.Iter {
    constructor(slice, pred) {
        super();
        this.slice = slice;
        this.pred = pred;
    }
    next() {
        if (this.slice.is_empty())
            return Option_1.None;
        let len = 1;
        const iter = this.slice.windows(2);
        let next = iter.next();
        while (next.is_some()) {
            const [l, r] = next.unwrap();
            if (this.pred(l, r)) {
                len++;
                next = iter.next();
            }
            else {
                break;
            }
        }
        const [head, tail] = this.slice.split_at(len);
        this.slice = new Vec_1.Vec(tail);
        return (0, Option_1.Some)(new GroupBy(new Vec_1.Vec(head), this.pred));
    }
}
exports.GroupBy = GroupBy;
//# sourceMappingURL=GroupyBy.js.map