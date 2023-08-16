import {Ord} from './cmp/Ord';
import {Ordering} from './cmp/Ordering';
import {PartialEq} from './cmp/PartialEq';
import {PartialOrd} from './cmp/PartialOrd';

export function merge_sort<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>(
  items: T[]
) {
  return divide(items);
}

function divide<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>(
  items: T[]
): T[] {
  const mid = Math.ceil(items.length / 2);
  let low = items.slice(0, mid);
  let high = items.slice(mid);
  if (mid > 1) {
    low = divide(low);
    high = divide(high);
  }
  return combine(low, high);
}

function combine<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>(
  low: T[],
  high: T[]
): T[] {
  let low_idx = 0;
  let high_idx = 0;
  const low_len = low.length;
  const high_len = high.length;
  const combined: T[] = [];
  while (low_idx < low_len || high_idx < high_len) {
    const low_item = low[low_idx];
    const high_item = high[high_idx];
    if (low_item !== undefined) {
      if (high_idx === undefined) {
        combined.push(low_item);
        low_idx++;
      } else {
        const cmp = low_item.cmp(high_item);
        if (cmp === Ordering.Less || cmp === Ordering.Equal) {
          combined.push(low_item);
          low_idx++;
        } else {
          combined.push(high_item);
          high_idx++;
        }
      }
    } else {
      if (high_item !== undefined) {
        combined.push(high_item);
        high_idx++;
      }
    }
  }
  return combined;
}
