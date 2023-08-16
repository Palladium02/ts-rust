import {Clone} from '../clone/Clone';
import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Some} from '../option/Option';

declare global {
  interface String
    extends Clone<string>,
      PartialEq<string>,
      PartialOrd<string>,
      Ord<string> {}
}

String.prototype.clone = function () {
  return String(this);
};

String.prototype.clone_from = function (_) {
  throw new Error('Cannot clone into String type as strings are immutable');
};

String.prototype.cmp = function (rhs) {
  if (this < rhs) return Ordering.Less;
  if (this > rhs) return Ordering.Greater;
  return Ordering.Equal;
};

String.prototype.max = function (rhs) {
  if (this < rhs) return rhs;
  return this as string;
};

// @ts-ignore
String.prototype.min = function (rhs) {
  if (this < rhs) return this;
  return rhs as string;
};

String.prototype.partial_cmp = function (rhs) {
  return Some(this.cmp(rhs));
};

String.prototype.eq = function (rhs) {
  return this === rhs;
};

String.prototype.ne = function (rhs) {
  return this !== rhs;
};
