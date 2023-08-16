import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Default} from '../default/Default';
import {Some} from '../option/Option';

declare global {
  interface Number
    extends Clone<number>,
      PartialEq<number>,
      PartialOrd<number>,
      Ord<number>,
      Default<number> {}
}

Number.prototype.clone = function () {
  return Number(this);
};

Number.prototype.clone_from = function (_) {
  throw new Error('Cannot clone into Number type');
};

Number.prototype.cmp = function (rhs) {
  if (Number(this) < rhs) return Ordering.Less;
  if (Number(this) > rhs) return Ordering.Greater;
  return Ordering.Equal;
};

// @ts-ignore
Number.prototype.max = function (rhs) {
  if (Number(this) < rhs) return rhs;
  return this;
};

// @ts-ignore
Number.prototype.min = function (rhs) {
  if (Number(this) < rhs) return this;
  return rhs;
};

Number.prototype.partial_cmp = function (rhs) {
  return Some(this.cmp(rhs));
};

Number.prototype.eq = function (rhs) {
  return this === rhs;
};

Number.prototype.ne = function (rhs) {
  return this !== rhs;
};

Number.prototype.default = () => 0;
