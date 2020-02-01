import { UntypedSelection, Selection } from "../../src";

describe("selection", () => {
    describe("merge()", () => {
        it("should merge { foo: true } and { bar: true } to create { foo: true, bar: true }", () => {
            // arrange
            const a: UntypedSelection = { foo: true };
            const b: UntypedSelection = { bar: true };

            // act
            const merged = Selection.merge(a, b);

            // assert
            expect(merged).toEqual({ foo: true, bar: true });
        });

        it("should merge { foo: { bar: true } } and { foo: { baz: true } } to create { foo: { bar: true, baz: true } }", () => {
            // arrange
            const a: UntypedSelection = { foo: { bar: true } };
            const b: UntypedSelection = { foo: { baz: true } };

            // act
            const merged = Selection.merge(a, b);

            // assert
            expect(merged).toEqual({ foo: { bar: true, baz: true } });
        });
    });

    describe("reduce()", () => {
        it("should reduce { foo: true, bar: true } by { foo: true } to create { bar: true }", () => {
            // arrange
            const a: UntypedSelection = { foo: true, bar: true };
            const b: UntypedSelection = { foo: true };

            // act
            const reduced = Selection.reduce(a, b);

            // assert
            expect(reduced).toEqual({ bar: true });
        });

        it("should reduce { foo: true, bar: true } by { foo: true, bar: true } to create null", () => {
            // arrange
            const a: UntypedSelection = { foo: true, bar: true };
            const b: UntypedSelection = { foo: true, bar: true };

            // act
            const reduced = Selection.reduce(a, b);

            // assert
            expect(reduced).toBeNull();
        });

        it("should not reduce { foo: true, bar: true } by { baz: true } and return same reference", () => {
            // arrange
            const a: UntypedSelection = { foo: true, bar: true };
            const b: UntypedSelection = { baz: true };

            // act
            const reduced = Selection.reduce(a, b);

            // assert
            expect(reduced).toBe(a);
        });

        it("should reduce { foo: { bar: true, baz: true }, khaz: { mo: true } } by { foo: { bar: true }, khaz: { mo: true, dan: true } } to create { foo: { baz: true } }", () => {
            // arrange
            const a: UntypedSelection = { foo: { bar: true, baz: true }, khaz: { mo: true } };
            const b: UntypedSelection = { foo: { bar: true }, khaz: { mo: true, dan: true } };

            // act
            const reduced = Selection.reduce(a, b);

            // assert
            expect(reduced).toEqual({ foo: { baz: true } });
        });
    });
});
