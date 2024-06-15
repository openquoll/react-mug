import { construction, MugOf } from './mug';
import { typeAsserts, typeEquals } from './test-utils';

describe('MugOf', () => {
  describe('used for a variable to conform to', () => {
    test('builds a type of one possible Mug with the construction of a primitive type', () => {
      const testMug: MugOf<number> = {
        [construction]: 1,
      };

      typeAsserts(typeEquals<typeof testMug, { [construction]: number }>());
    });

    test('builds a type of every possible nontrivial Mug with the construction of a nested type', () => {
      const testMug: MugOf<{
        primitive: number;
        object: { x: number };
        primitiveArray: number[];
        objectArray: { x: number }[];
        tuple: [number, { x: number }];
      }> = {
        [construction]: {
          primitive: 1,
          object: { x: 1 },
          primitiveArray: [1, 1],
          objectArray: [{ x: 1 }, { x: 1 }],
          tuple: [1, { x: 1 }],
        },
      };

      typeAsserts(
        typeEquals<
          typeof testMug,
          {
            [construction]: {
              primitive: { [construction]: number } | number;
              object:
                | { [construction]: { x: { [construction]: number } | number } }
                | { x: { [construction]: number } | number };
              primitiveArray:
                | { [construction]: ({ [construction]: number } | number)[] }
                | ({ [construction]: number } | number)[];
              objectArray:
                | {
                    [construction]: (
                      | { [construction]: { x: { [construction]: number } | number } }
                      | { x: { [construction]: number } | number }
                    )[];
                  }
                | (
                    | { [construction]: { x: { [construction]: number } | number } }
                    | { x: { [construction]: number } | number }
                  )[];
              tuple:
                | {
                    [construction]: [
                      { [construction]: number } | number,
                      (
                        | { [construction]: { x: { [construction]: number } | number } }
                        | { x: { [construction]: number } | number }
                      ),
                    ];
                  }
                | [
                    { [construction]: number } | number,
                    (
                      | { [construction]: { x: { [construction]: number } | number } }
                      | { x: { [construction]: number } | number }
                    ),
                  ];
            };
          }
        >(),
      );
    });

    test('builds a nontrivial Mug type with the construction of a Mug type', () => {
      type SourceMug = MugOf<{ x: number }>;

      const testMug: MugOf<SourceMug> = {
        [construction]: {
          x: 1,
        },
      };

      typeAsserts(
        typeEquals<
          typeof testMug,
          { [construction]: { x: { [construction]: number } | number } }
        >(),
      );
    });
  });

  describe('as a type for a class to implement', () => {});
});

describe('StateOf', () => {});

describe('MugLikeOf', () => {});
