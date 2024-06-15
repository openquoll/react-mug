export function typeAsserts(result: true): void;
export function typeAsserts(...args: any): any {}

export type TypeExtendsResult<A, B> = A extends B ? true : false;
export function typeExtends<A, B>(): TypeExtendsResult<A, B>;
export function typeExtends<A, B>(a: A, b: B): TypeExtendsResult<A, B>;
export function typeExtends(...args: any): any {}

export type TypeEqualsResult<A, B> = A extends B ? (B extends A ? true : false) : false;
export function typeEquals<A, B>(): TypeEqualsResult<A, B>;
export function typeEquals<A, B>(a: A, b: B): TypeEqualsResult<A, B>;
export function typeEquals(...args: any): any {}
