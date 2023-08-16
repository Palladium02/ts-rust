import {Iter} from './Iterator';

export interface IntoIter<T> {
  into_iter(): Iter<T>;
}
