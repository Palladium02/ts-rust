import { Ord } from '../cmp/Ord';
import { PartialEq } from '../cmp/PartialEq';
import { PartialOrd } from '../cmp/PartialOrd';
import { Iter } from '../iter/Iterator';
import { Option } from '../option/Option';
import { Vec } from '../vec/Vec';
export declare class Split<T extends PartialEq<T> & PartialOrd<T> & Ord<T>, P extends (t: T) => boolean> extends Iter<T[]> {
    private slice;
    private predicate;
    constructor(slice: Vec<T>, predicate: P);
    next(): Option<T[]>;
}
