import {Ordering} from './Ordering';
import {PartialEq} from './PartialEq';
import {PartialOrd} from './PartialOrd';

export interface Ord<Rhs extends PartialEq<Rhs> & PartialOrd<Rhs>> {
  cmp(rhs: Rhs): Ordering;
  max(rhs: Rhs): Rhs;
  min(rhs: Rhs): Rhs;
}
