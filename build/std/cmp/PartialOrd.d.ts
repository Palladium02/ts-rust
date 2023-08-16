import { Option } from '../option/Option';
import { Ordering } from './Ordering';
import { PartialEq } from './PartialEq';
export interface PartialOrd<Rhs extends PartialEq<Rhs>> {
    partial_cmp(rhs: Rhs): Option<Ordering>;
}
