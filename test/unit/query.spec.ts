import { SourceTypeSymbol, SourceType, Property, Query } from "../../src";

describe("query", () => {
    /**
     * [notes] it works, but only if the custom methods are at the beginning of the chain
     */
    it("should allow for extension by inheritance (while keeping chaining functionality)", () => {
        // arrange
        class CoffeeCupType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable(["optional"]));
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable(["optional"]));
            volume = Property.create("volume", Number, b => b.loadable(["optional", "nullable"]));
        }

        class CoffeeBeansType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["optional"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable(["optional"]));
        }

        class CoffeeCupTypeQuery extends Query<CoffeeCupType> {
            constructor() {
                super(new CoffeeCupType());
            }

            includeLabel() {
                return this.include(s => s.select(x => x.label));
            }

            includeVolume() {
                return this.include(s => s.select(x => x.volume));
            }
        }

        // act
        let queriedType = new CoffeeCupTypeQuery()
            .includeLabel()
            .includeVolume()
            .include(x => x.select(x => x.beans, s => s.select(x => x.tasty)))
            .build();

        // assert
        expect(queriedType.selection.label).toBeTrue();
        expect(queriedType.selection.volume).toBeTrue();
        expect(queriedType.selection.beans).toBeDefined();
        expect(queriedType.selection.beans.tasty).toBeTrue();
    });
});
