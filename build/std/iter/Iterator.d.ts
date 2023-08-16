import { Option } from '../option/Option';
import { Enumerate } from './Enumerate';
export declare abstract class Iter<T> {
    abstract next(): Option<T>;
    [Symbol.iterator](): IterableIterator<T>;
    enumerate(): Enumerate<T>;
    position(predicate: (item: T) => boolean): Option<number>;
    finish(): T[];
}
