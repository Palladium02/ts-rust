"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Some = exports.None = void 0;
const Ordering_1 = require("../cmp/Ordering");
exports.None = {
    tag: 'none',
    is_some: () => false,
    is_none: () => true,
    expect: msg => {
        throw new Error(msg);
    },
    unwrap: () => {
        throw new Error('');
    },
    unwrap_or: fallback => fallback,
    unwrap_or_else: fn => fn(),
    map: _ => exports.None,
    inspect: () => exports.None,
    map_or: (fallback, _) => fallback,
    map_or_else: (fallback, _) => fallback(),
    and: _ => exports.None,
    and_then: _ => exports.None,
    filter: () => exports.None,
    or: optb => optb,
    or_else: fn => fn(),
    xor: optb => {
        if (optb.is_some())
            return optb;
        return exports.None;
    },
    zip: _ => exports.None,
    zip_with: (_, __) => exports.None,
    clone: () => exports.None,
    clone_from: _ => {
        throw new Error('Cannot clone into None type');
    },
    eq: rhs => {
        return !rhs.is_some();
    },
    ne: rhs => {
        return rhs.is_some();
    },
    partial_cmp(rhs) {
        if (rhs.is_some())
            return exports.None;
        return Some(Ordering_1.Ordering.Equal);
    },
    cmp(rhs) {
        if (rhs.is_none())
            return Ordering_1.Ordering.Equal;
        return Ordering_1.Ordering.Less;
    },
    max(rhs) {
        return rhs;
    },
    min(rhs) {
        return exports.None;
    },
};
function Some(value) {
    return {
        tag: 'some',
        is_some: () => true,
        is_none: () => false,
        expect: () => value,
        unwrap: () => value,
        unwrap_or: _ => value,
        unwrap_or_else: _ => value,
        map: fn => Some(fn(value)),
        inspect: fn => {
            fn(value);
            return Some(value);
        },
        map_or: (_, fn) => fn(value),
        map_or_else: (_, fn) => fn(value),
        and: optb => optb,
        and_then: fn => fn(value),
        filter: predicate => (predicate(value) ? Some(value) : exports.None),
        or: _ => Some(value),
        or_else: _ => Some(value),
        xor: optb => {
            if (optb.is_some())
                return exports.None;
            return Some(value);
        },
        zip: other => (other.is_none() ? exports.None : Some([value, other.unwrap()])),
        zip_with: (other, fn) => other.is_none() ? exports.None : Some(fn(value, other.unwrap())),
        clone: () => Some(value),
        clone_from: source => {
            if (source.is_none())
                throw new Error('Cannot copy None type into Some type');
            value = source.unwrap();
        },
        eq: rhs => {
            if (rhs.is_none())
                return false;
            const unwrapped = rhs.unwrap();
            return unwrapped === value;
        },
        ne: rhs => {
            if (rhs.is_none())
                return true;
            const unwrapped = rhs.unwrap();
            return unwrapped !== value;
        },
        partial_cmp(rhs) {
            if (rhs.is_none())
                return exports.None;
            const unwrapped = rhs.unwrap();
            if (unwrapped > value)
                return Some(Ordering_1.Ordering.Less);
            if (unwrapped < value)
                return Some(Ordering_1.Ordering.Greater);
            return Some(Ordering_1.Ordering.Equal);
        },
        cmp(rhs) {
            if (rhs.is_none())
                return Ordering_1.Ordering.Greater;
            const unwrapped = rhs.unwrap();
            if (unwrapped > value)
                return Ordering_1.Ordering.Less;
            if (unwrapped < value)
                return Ordering_1.Ordering.Greater;
            return Ordering_1.Ordering.Equal;
        },
        max(rhs) {
            if (rhs.is_none())
                return Some(value);
            const unwrapped = rhs.unwrap();
            if (unwrapped > value)
                return rhs;
            if (unwrapped < value)
                return Some(value);
            return rhs;
        },
        min(rhs) {
            if (rhs.is_none())
                return Some(value);
            const unwrapped = rhs.unwrap();
            if (unwrapped < value)
                return rhs;
            if (unwrapped > value)
                return Some(value);
            return rhs;
        },
    };
}
exports.Some = Some;
//# sourceMappingURL=Option.js.map