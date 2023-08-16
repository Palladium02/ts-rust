"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Err = exports.Ok = void 0;
const Ordering_1 = require("../cmp/Ordering");
const Option_1 = require("../option/Option");
function Ok(ok) {
    return {
        tag: 'ok',
        is_ok: () => true,
        is_ok_and: fn => fn(ok),
        is_err: () => false,
        is_err_and: _ => false,
        unwrap: () => ok,
        unwrap_or: _ => ok,
        unwrap_or_else: _ => ok,
        unwrap_err: () => {
            throw new Error('Cannot unwrap Ok type');
        },
        ok: () => (0, Option_1.Some)(ok),
        err: () => Option_1.None,
        map: fn => Ok(fn(ok)),
        map_or: (_, fn) => fn(ok),
        map_or_else: (_, fn) => fn(ok),
        map_err: _ => Ok(ok),
        inspect: fn => {
            fn(ok);
            return Ok(ok);
        },
        inspect_err: _ => Ok(ok),
        expect: _ => ok,
        expect_err: msg => {
            throw new Error(msg);
        },
        and: res => res,
        and_then: fn => fn(ok),
        or: _ => Ok(ok),
        or_else: _ => Ok(ok),
        clone: () => Ok(ok),
        clone_from: source => {
            if (source.is_err())
                throw new Error('Cannot clone Err type into Ok type');
            ok = source.unwrap();
        },
        eq: rhs => {
            if (rhs.is_err())
                return false;
            const unwrapped = rhs.unwrap();
            return ok === unwrapped;
        },
        ne: rhs => {
            if (rhs.is_err())
                return true;
            const unwrapped = rhs.unwrap();
            return ok !== unwrapped;
        },
        partial_cmp: rhs => {
            if (rhs.is_err())
                return Option_1.None;
            const unwrapped = rhs.unwrap();
            if (ok < unwrapped)
                return (0, Option_1.Some)(Ordering_1.Ordering.Less);
            if (ok > unwrapped)
                return (0, Option_1.Some)(Ordering_1.Ordering.Greater);
            return (0, Option_1.Some)(Ordering_1.Ordering.Equal);
        },
        cmp: rhs => {
            if (rhs.is_err())
                return Ordering_1.Ordering.Greater;
            return Ok(ok).partial_cmp(rhs).unwrap();
        },
        max: rhs => {
            if (rhs.is_err())
                return Ok(ok);
            const cmp = Ok(ok).cmp(rhs);
            if (cmp === Ordering_1.Ordering.Less)
                return rhs;
            return Ok(ok);
        },
        min: rhs => {
            if (rhs.is_err())
                return rhs;
            const cmp = Ok(ok).cmp(rhs);
            if (cmp === Ordering_1.Ordering.Less)
                return Ok(ok);
            return rhs;
        },
    };
}
exports.Ok = Ok;
function Err(err) {
    return {
        tag: 'err',
        is_ok: () => false,
        is_ok_and: _ => false,
        is_err: () => true,
        is_err_and: fn => fn(err),
        unwrap: () => {
            throw new Error('Cannot unwrap Err type');
        },
        unwrap_or: fallback => fallback,
        unwrap_or_else: op => op(err),
        unwrap_err: () => err,
        ok: () => Option_1.None,
        err: () => (0, Option_1.Some)(err),
        map: _ => Err(err),
        map_or: (fallback, _) => fallback,
        map_or_else: (fallback, _) => fallback(err),
        map_err: fn => Err(fn(err)),
        inspect: _ => Err(err),
        inspect_err: fn => {
            fn(err);
            return Err(err);
        },
        expect: msg => {
            throw new Error(msg);
        },
        expect_err: _ => err,
        and: _ => Err(err),
        and_then: _ => Err(err),
        or: res => {
            if (res.is_err())
                return Err(err);
            return res;
        },
        or_else: op => Err(op(err)),
        clone: () => Err(err),
        clone_from: source => {
            if (source.is_ok())
                throw new Error('Cannot clone Ok type into Err type');
            err = source.unwrap();
        },
        eq: rhs => {
            if (rhs.is_ok())
                return false;
            return err === rhs.err().unwrap();
        },
        ne: rhs => {
            if (rhs.is_ok())
                return true;
            return err !== rhs.err().unwrap();
        },
        partial_cmp: rhs => {
            if (rhs.is_ok())
                return Option_1.None;
            const unwrapped = rhs.err().unwrap();
            if (err < unwrapped)
                return (0, Option_1.Some)(Ordering_1.Ordering.Less);
            if (err > unwrapped)
                return (0, Option_1.Some)(Ordering_1.Ordering.Greater);
            return (0, Option_1.Some)(Ordering_1.Ordering.Equal);
        },
        cmp: rhs => {
            if (rhs.is_ok())
                return Ordering_1.Ordering.Less;
            return Err(err).partial_cmp(rhs).unwrap();
        },
        max: rhs => {
            if (rhs.is_ok())
                return rhs;
            const cmp = Err(err).cmp(rhs);
            if (cmp === Ordering_1.Ordering.Less)
                return rhs;
            return Err(err);
        },
        min: rhs => {
            if (rhs.is_err())
                return Err(err);
            const cmp = Err(err).cmp(rhs);
            if (cmp === Ordering_1.Ordering.Less)
                return Err(err);
            return rhs;
        },
    };
}
exports.Err = Err;
//# sourceMappingURL=Result.js.map