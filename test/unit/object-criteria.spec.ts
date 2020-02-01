import { ObjectCriteria } from "../../src";

describe("object-criteria", () => {
    describe("filter()", () => {
        interface Foo {
            bar: number;
            baz: string;
        }

        const unfiltered: Foo[] = [
            { bar: 1, baz: "khaz" },
            { bar: 2, baz: "khaz" },
            { bar: 3, baz: "mo" },
            { bar: 4, baz: "dan" }
        ];

        it("'==' operator", () => {
            // arrange
            const criteria: ObjectCriteria = [
                {
                    bar: [{ op: "==", value: 2 }]
                }
            ];

            // act
            const filtered = ObjectCriteria.filter(unfiltered, criteria);

            // assert
            expect(filtered).toEqual(unfiltered.filter(x => x.bar === 2));
        });

        it("'in' operator", () => {
            // arrange
            const criteria: ObjectCriteria = [
                {
                    bar: [{ op: "in", values: new Set([1, 2]) }]
                }
            ];

            // act
            const filtered = ObjectCriteria.filter(unfiltered, criteria);

            // assert
            expect(filtered).toEqual(unfiltered.filter(x => [1, 2].includes(x.bar)));
        });

        it("'or' combined value-criteria", () => {
            // arrange
            const criteria: ObjectCriteria = [
                {
                    bar: [{ op: "==", value: 1 }, { op: "==", value: 2 }]
                }
            ];

            // act
            const filtered = ObjectCriteria.filter(unfiltered, criteria);

            // assert
            expect(filtered).toEqual(unfiltered.filter(x => x.bar === 1 || x.bar === 2));
        });

        it("'or' combined object-criteria", () => {
            // arrange
            const criteria: ObjectCriteria = [
                {
                    bar: [{ op: "==", value: 1 }]
                },
                {
                    bar: [{ op: "==", value: 2 }]
                }
            ];

            // act
            const filtered = ObjectCriteria.filter(unfiltered, criteria);

            // assert
            expect(filtered).toEqual(unfiltered.filter(x => x.bar === 1 || x.bar === 2));
        });
    });
});
