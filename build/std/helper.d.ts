import { Ord } from './cmp/Ord';
import { PartialEq } from './cmp/PartialEq';
import { PartialOrd } from './cmp/PartialOrd';
export declare function merge_sort<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>(items: T[]): T[];
