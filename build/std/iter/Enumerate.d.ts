import { Option } from '../option/Option';
import { Iter } from './Iterator';
export declare class Enumerate<T> extends Iter<[number, T]> {
    private iter;
    private i;
    constructor(iter: Iter<T>);
    next(): Option<[number, T]>;
}
