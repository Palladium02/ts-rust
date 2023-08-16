"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Windows = void 0;
const Iterator_1 = require("../iter/Iterator");
const Option_1 = require("../option/Option");
class Windows extends Iterator_1.Iter {
    constructor(windows = []) {
        super();
        this.next_pointer = 0;
        this.windows = windows;
    }
    clone() {
        return new Windows(this.windows);
    }
    clone_from(source) {
        this.windows = [...source];
    }
    next() {
        if (this.windows.length === 0 ||
            this.next_pointer === this.windows.length) {
            this.next_pointer = 0;
            return Option_1.None;
        }
        const head = this.windows[this.next_pointer];
        this.next_pointer++;
        return (0, Option_1.Some)(head);
    }
}
exports.Windows = Windows;
//# sourceMappingURL=Windows.js.map