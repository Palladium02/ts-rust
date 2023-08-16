export interface Clone<T> {
  clone(): T;
  clone_from(source: T): void;
}
