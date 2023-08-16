import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
import { Iter } from '../iter/Iterator';
import { Option } from '../option/Option';
import { Vec } from '../vec/Vec';
export declare class GroupBy<T extends PartialEq<T> & PartialOrd<T> & Ord<T>, P extends (t: T, u: T) => boolean> extends Iter<GroupBy<T, P>> {
    private slice;
    private pred;
    constructor(slice: Vec<T>, pred: P);
    next(): Option<GroupBy<T, P>>;
}
