import { SourceTypeSymbol, SourceType, Property, QueryBuilder, Query, Selection } from "../../src";
import { CanvasType } from "../system/facade/model";

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

        class CoffeeCupTypeQuery extends QueryBuilder<CoffeeCupType> {
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

    describe("reduce()", () => {
        describe("without filtering", () => {
            it("Canvas() reduced by Canvas() should be null", () => {
                // arrange
                const a = new QueryBuilder(new CanvasType()).build();
                const b = new QueryBuilder(new CanvasType()).build();

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toBeNull();
            });

            it("Canvas() reduced by Canvas/Author() should be null", () => {
                // arrange
                const a = new QueryBuilder(new CanvasType()).build();
                const b = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author)).build();

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toBeNull();
            });

            it("Canvas/Author() reduced by Canvas() should do nothing", () => {
                // arrange
                const a = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author)).build();
                const b = new QueryBuilder(new CanvasType()).build();

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toBe(a);
            });

            it("Canvas/Author() reduced by Canvas/Author() should be null", () => {
                // arrange
                const a = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author)).build();
                const b = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author)).build();

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toBeNull();
            });

            it("Canvas/{Author,Shapes}() reduced by Canvas/Author() should be Canvas/Shapes()", () => {
                // arrange
                const a = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author).select(x => x.shapes)).build();
                const b = new QueryBuilder(new CanvasType()).include(x => x.select(x => x.author)).build();

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toEqual(new QueryBuilder(new CanvasType()).include(x => x.select(x => x.shapes)).build());
            });
        });

        describe("with filtering", () => {
            it("Canvas({ id == 1 }) reduced by Canvas({ id == 1}) should be null", () => {
                // arrange
                const a: Query<CanvasType, Selection<CanvasType>> = {
                    criteria: [{ id: [{ op: "==", value: 1 }] }],
                    selection: {},
                    type: new CanvasType()
                };

                const b: Query<CanvasType, Selection<CanvasType>> = {
                    criteria: [{ id: [{ op: "==", value: 1 }] }],
                    selection: {},
                    type: new CanvasType()
                };

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toBeNull();
            });

            it("Canvas({ id in [1, 2] }) reduced by Canvas({ id == 1}) should be Canvas({ id == 2})", () => {
                // arrange
                const a: Query<CanvasType, Selection<CanvasType>> = {
                    criteria: [{ id: [{ op: "in", values: new Set([1, 2]) }] }],
                    selection: {},
                    type: new CanvasType()
                };

                const b: Query<CanvasType, Selection<CanvasType>> = {
                    criteria: [{ id: [{ op: "==", value: 1 }] }],
                    selection: {},
                    type: new CanvasType()
                };

                // act
                const reduced = Query.reduce(a, b);

                // assert
                expect(reduced).toEqual({
                    criteria: [{ id: [{ op: "==", value: 2 }] }],
                    selection: {},
                    type: new CanvasType()
                });
            });
        });
    });
});
