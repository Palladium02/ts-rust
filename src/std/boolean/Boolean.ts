import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Some} from '../option/Option';

declare global {
  interface Boolean
    extends Clone<boolean>,
      PartialEq<boolean>,
      PartialOrd<boolean>,
      Ord<boolean> {}
}

Boolean.prototype.clone = function () {
  return Boolean(this);
};

Boolean.prototype.clone_from = function (_) {
  throw new Error('Cannot clone into Boolean type');
};

Boolean.prototype.cmp = function (rhs) {
  if (this < rhs) return Ordering.Less;
  if (this > rhs) return Ordering.Greater;
  return Ordering.Equal;
};

// @ts-ignore
Boolean.prototype.max = function (rhs) {
  if (this < rhs) return rhs;
  return this;
};

// @ts-ignore
Boolean.prototype.min = function (rhs) {
  if (this < rhs) return this;
  return rhs;
};

Boolean.prototype.partial_cmp = function (rhs) {
  return Some(this.cmp(rhs));
};

Boolean.prototype.eq = function (rhs) {
  return this === rhs;
};

Boolean.prototype.ne = function (rhs) {
  return this !== rhs;
};
