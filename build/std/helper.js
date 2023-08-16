"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge_sort = void 0;
const Ordering_1 = require("./cmp/Ordering");
function merge_sort(items) {
    return divide(items);
}
exports.merge_sort = merge_sort;
function divide(items) {
    const mid = Math.ceil(items.length / 2);
    let low = items.slice(0, mid);
    let high = items.slice(mid);
    if (mid > 1) {
        low = divide(low);
        high = divide(high);
    }
    return combine(low, high);
}
function combine(low, high) {
    let low_idx = 0;
    let high_idx = 0;
    const low_len = low.length;
    const high_len = high.length;
    const combined = [];
    while (low_idx < low_len || high_idx < high_len) {
        const low_item = low[low_idx];
        const high_item = high[high_idx];
        if (low_item !== undefined) {
            if (high_idx === undefined) {
                combined.push(low_item);
                low_idx++;
            }
            else {
                const cmp = low_item.cmp(high_item);
                if (cmp === Ordering_1.Ordering.Less || cmp === Ordering_1.Ordering.Equal) {
                    combined.push(low_item);
                    low_idx++;
                }
                else {
                    combined.push(high_item);
                    high_idx++;
                }
            }
        }
        else {
            if (high_item !== undefined) {
                combined.push(high_item);
                high_idx++;
            }
        }
    }
    return combined;
}
//# sourceMappingURL=helper.js.map