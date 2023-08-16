import {Ord} from '../cmp/Ord';
import {Ordering} from '../cmp/Ordering';
import {PartialEq} from '../cmp/PartialEq';
import {PartialOrd} from '../cmp/PartialOrd';
import {Iter} from '../iter/Iterator';
import {None, Option, Some} from '../option/Option';
import {panic} from '../panic';

export class LinkedList<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>
  implements
    PartialEq<LinkedList<T>>,
    PartialOrd<LinkedList<T>>,
    Ord<LinkedList<T>>
{
  private head: Option<LinkedNode<T>> = None;
  private tail: Option<LinkedNode<T>> = None;
  private length = 0;

  public append(other: LinkedList<T>) {
    let node = other.pop_front();
    while (node.is_some()) {
      this.length++;
      this.push_back(node.unwrap());
      node = other.pop_front();
    }
  }

  public is_empty(): boolean {
    return this.head.is_none();
  }

  public len() {
    return this.length;
  }

  public clear() {
    this.length = 0;
    this.head = None;
  }

  public contains(x: T): boolean {
    let next = this.head;
    while (next.is_some()) {
      if (next.unwrap().get_value().eq(x)) return true;
      next = next.unwrap().get_next();
    }
    return false;
  }

  public front(): Option<T> {
    return this.head.is_some() ? Some(this.head.unwrap().get_value()) : None;
  }

  public back(): Option<T> {
    return this.tail.is_some() ? Some(this.tail.unwrap().get_value()) : None;
  }

  public push_front(elt: T) {
    const node = new LinkedNode(elt);
    this.length++;
    if (this.head.is_none()) {
      this.head = Some(node);
      this.tail = Some(node);
    } else {
      const old_head = this.head;
      node.set_next(old_head);
      this.head = Some(node);
    }
  }

  public pop_front(): Option<T> {
    if (this.head.is_none()) return None;
    const new_head = this.head.unwrap().get_next();
    const value = this.head.unwrap().get_value();
    this.head = new_head;
    if (this.head.is_none()) this.tail = None;
    this.length--;
    return Some(value);
  }

  public push_back(elt: T) {
    const node = new LinkedNode(elt);
    this.length++;
    if (this.head.is_none()) {
      this.head = Some(node);
      this.tail = Some(node);
    } else {
      const old_tail = this.tail;
      node.set_previous(old_tail);
      this.tail = Some(node);
    }
  }

  public pop_back(): Option<T> {
    if (this.tail.is_none()) return None;
    const new_tail = this.tail.unwrap().get_previous();
    const value = this.tail.unwrap().get_value();
    this.tail = new_tail;
    if (this.tail.is_none()) this.head = None;
    this.length--;
    return Some(value);
  }

  public split_off(at: number) {
    if (at > this.len()) panic('Index out of bounds');
    let node = this.head;
    for (let i = 0; i < at; i++) {
      node = node.unwrap().get_next();
    }
    this.tail = node.unwrap().get_previous();
    this.length = this.len() - at;
    const new_list = new LinkedList<T>();
    while (node.is_some()) {
      new_list.push_back(node.unwrap().get_value());
      node = node.unwrap().get_next();
    }
    return new_list;
  }

  public remove(at: number) {
    if (at > this.len()) panic('Index out of bounds');
    let node = this.head;
    for (let i = 0; i < at; i++) {
      node = node.unwrap().get_next();
    }
    const next = node.unwrap().get_next();
    const previous = node.unwrap().get_previous();
    previous.unwrap().set_next(next);
    if (next.is_none()) this.tail = previous;
  }

  public drain_filter<F extends (t: T) => boolean>(f: F): Iter<T> {
    const self = this;
    return new (class DrainFilter extends Iter<T> {
      private values: T[];
      private next_pointer = 0;

      public constructor() {
        super();
        this.values = [];
        let node = self.head;
        while (node.is_some()) {
          this.values.push(node.unwrap().get_value());
          node = node.unwrap().get_next();
        }
        this.values = this.values.filter(f);
      }

      public next(): Option<T> {
        if (
          this.values.length === 0 ||
          this.next_pointer === this.values.length
        ) {
          this.next_pointer = 0;
          return None;
        }
        const head = this.values[this.next_pointer];
        this.next_pointer++;
        return Some(head);
      }
    })();
  }

  eq(rhs: LinkedList<T>): boolean {
    if (this.len() !== rhs.len()) return false;
    let self_node = this.head;
    let rhs_node = rhs.head;
    while (self_node.is_some()) {
      if (self_node.unwrap().get_value().ne(rhs_node.unwrap().get_value()))
        return false;
      self_node = self_node.unwrap().get_next();
      rhs_node = rhs_node.unwrap().get_next();
    }

    return true;
  }

  ne(rhs: LinkedList<T>): boolean {
    return !this.eq(rhs);
  }

  partial_cmp(rhs: LinkedList<T>): Option<Ordering> {
    if (this.len() < rhs.len()) return Some(Ordering.Less);
    if (this.len() > rhs.len()) return Some(Ordering.Less);
    let self_node = this.head;
    let rhs_node = rhs.head;
    while (self_node.is_some()) {
      const cmp = self_node
        .unwrap()
        .get_value()
        .cmp(rhs_node.unwrap().get_value());
      if (cmp === Ordering.Less) return Some(Ordering.Less);
      if (cmp === Ordering.Greater) return Some(Ordering.Greater);
      self_node = self_node.unwrap().get_next();
      rhs_node = rhs_node.unwrap().get_next();
    }

    return Some(Ordering.Equal);
  }

  cmp(rhs: LinkedList<T>): Ordering {
    return this.partial_cmp(rhs).unwrap();
  }

  max(rhs: LinkedList<T>): LinkedList<T> {
    return this.cmp(rhs) === Ordering.Less ? rhs : this;
  }

  min(rhs: LinkedList<T>): LinkedList<T> {
    return this.cmp(rhs) === Ordering.Less ? this : rhs;
  }

  static from_iter<T extends PartialEq<T> & PartialOrd<T> & Ord<T>>(
    iter: Iter<T>
  ): LinkedList<T> {
    const linked_list = new LinkedList<T>();
    for (const item of iter) {
      linked_list.push_back(item);
    }
    return linked_list;
  }
}

class LinkedNode<T> {
  private value: T;
  private next: Option<LinkedNode<T>> = None;
  private previous: Option<LinkedNode<T>>;

  public constructor(value: T, previous: Option<LinkedNode<T>> = None) {
    this.value = value;
    this.previous = previous;
  }

  public get_previous() {
    return this.previous;
  }

  public set_previous(node: Option<LinkedNode<T>>) {
    this.previous = node;
  }

  public get_next() {
    return this.next;
  }

  public set_next(node: Option<LinkedNode<T>>) {
    this.next = node;
  }

  public get_value() {
    return this.value;
  }
}
