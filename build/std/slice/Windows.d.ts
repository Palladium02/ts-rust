import { Clone } from '../clone/Clone';
import { Iter } from '../iter/Iterator';
import { Option } from '../option/Option';
export declare class Windows<T> extends Iter<T> implements Clone<Windows<T>> {
    private windows;
    private next_pointer;
    constructor(windows?: T[]);
    clone(): Windows<T>;
    clone_from(source: Windows<T>): void;
    next(): Option<T>;
}
