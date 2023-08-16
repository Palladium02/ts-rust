import {Clone} from '../clone/Clone';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {Tuple} from '../types';

export class Windows<T> extends Iter<T> implements Clone<Windows<T>> {
  private windows: T[];
  private next_pointer = 0;

  public constructor(windows: T[] = []) {
    super();
    this.windows = windows;
  }

  clone(): Windows<T> {
    return new Windows<T>(this.windows);
  }

  clone_from(source: Windows<T>): void {
    this.windows = [...source];
  }

  public next(): Option<T> {
    if (
      this.windows.length === 0 ||
      this.next_pointer === this.windows.length
    ) {
      this.next_pointer = 0;
      return None;
    }
    const head = this.windows[this.next_pointer];
    this.next_pointer++;
    return Some(head);
  }
}
