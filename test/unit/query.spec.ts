import { SourceTypeSymbol, SourceType, Property, Query, TappedType, DefaultQuerySelection } from "../../src";

describe("query", () => {
    /**
     * [notes] it works, but only if the custom methods are at the beginning of the chain
     */
    it("should allow for extension by inheritance (while keeping chaining functionality)", () => {
        /**
         * [arrange]
         */
        class CoffeeCupType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeCupType);
            label = Property.create("label", String, b => b.loadable(["optional"]));
            beans = Property.create("beans", CoffeeBeansType, b => b.loadable(["optional"]));
            volume = Property.create("volume", Number, b => b.loadable(["optional"]));
        }

        class CoffeeBeansType {
            [SourceTypeSymbol] = SourceType.createMetadata(CoffeeBeansType);
            origin = Property.create("origin", String, b => b.loadable(["optional"]));
            tasty = Property.create("tasty", Boolean, b => b.loadable(["optional"]));
        }

        // [todo] 'extends Selection<CoffeeCupType>' can possibly be removed in the future
        class CoffeeCupTypeQuery<S extends TappedType<CoffeeCupType> = DefaultQuerySelection<CoffeeCupType>> extends Query<CoffeeCupType, S> {
            constructor() {
                super(new CoffeeCupType());
            }

            includeLabel() {
                let selectedType = this.include(s => s.select(x => x.label)).buildSelection();

                return this as any as CoffeeCupTypeQuery<typeof selectedType>;
            }

            includeVolume() {
                let selectedType = this.include(s => s.select(x => x.volume)).buildSelection();

                return this as any as CoffeeCupTypeQuery<typeof selectedType>;
            }
        }

        /**
         * [act]
         */
        let queriedType = new CoffeeCupTypeQuery()
            .includeLabel()
            .includeVolume()
            .include(x => x.select(x => x.beans, s => s.select(x => x.tasty)))
            .build();

        /**
         * [assert] (compile time check only)
         */
        queriedType.selected.volume;
        queriedType.selected.label;
        queriedType.selected.beans.value.tasty;
    });
});
