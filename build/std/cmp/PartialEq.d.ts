export interface PartialEq<Rhs> {
    eq(rhs: Rhs): boolean;
    ne(rhs: Rhs): boolean;
}
