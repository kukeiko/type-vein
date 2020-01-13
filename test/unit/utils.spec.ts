import { permutate } from "../../src";

describe("utils", () => {
    it("permutate() should permutate [1, 2] & [3, 4] into [[1, 3], [1, 4], [2, 3], [2, 4]]", () => {
        // arrange
        let a = [1, 2];
        let b = [3, 4];
        let expected = [[1, 3], [1, 4], [2, 3], [2, 4]];

        // act
        let actual = permutate([a, b]);

        expect(actual).toEqual(expected);
    });
});
