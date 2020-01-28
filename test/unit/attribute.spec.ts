import { Attribute } from "../../src";

describe("attribute", () => {
    it("allAttributes() should contain all the attributes shipped with type-vein", () => {
        let expected: Attribute[] = ["filterable", "indexable", "iterable", "navigable", "unique"];
        let actual = Attribute.all();

        expected.sort();
        actual.sort();

        expect(actual).toEqual(expected);
    });

    it("hasAttribute() should return true if object extends { [attribute]: true }", () => {
        let hasIterableAttribute = {
            iterable: true
        };

        expect(Attribute.has(hasIterableAttribute, "iterable"))
            .toBe(true, `expected '${JSON.stringify(hasIterableAttribute)}' to have a property named 'iterable' set to true`);
    });
});
