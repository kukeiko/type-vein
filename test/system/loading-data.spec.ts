import { Domain, QueryBuilder } from "../../src";
import { CanvasType, CircleType, SquareType } from "./facade/model";
import { canvasInstanceLoader } from "./facade/instance-loaders";

/**
 * Tests that showcase how data is loaded via type-vein.
 */
describe("loading data via the domain", () => {
    /**
     * This test will use the Canvas type since it contains a "shapes" collection which can contain both Circle and
     * Square types, which are differentiated by their "type" property that is either set to "circle" or "square".
     */
    it("loading data that references union types", async done => {
        // Arrange
        const domain = new Domain();

        /**
         * From the facade get the loader that will actually load CanvasType instances and register it at the domain
         * so it knows how to load CanvasType instances when it is queried to do so.
         */
        domain.addLoader(new CanvasType(), canvasInstanceLoader);

        // Create a Query that will define which optional properties we want to have included.
        const query = new QueryBuilder(new CanvasType())
            .include(s => s
                // include the AuthorType reference and also its name
                .select(canvas => canvas.author, s => s.select(author => author.name))
                // include the shapes (made up of CircleType and SquareType) and pick their common property
                .select(canvas => canvas.shapes, s => s
                    .select(shape => shape.area)
                )
                // for CircleType, we want to include the radius
                .select(canvas => canvas.shapes, () => CircleType, s => s
                .select(circle => circle.radius)
                )
                // for SquareType, we want to include the length
                .select(canvas => canvas.shapes, () => SquareType, s => s
                    .select(circle => circle.length)
                )
            )
            .build();

        try {
            // act

            // Execute the Query using the Domain to load the instances
            const result = await domain.executeQuery(query);

            // assert

            /**
             * [todo] assertions seem incomplete in terms of what they showcase.
             */
            for (let instance of result) {
                // making sure the optional properties we've included are loaded (not undefined)
                expect(instance.author).toBeDefined();
                expect(instance.author.name).toBeDefined();
                expect(instance.shapes).toBeDefined();

                for (let shape of instance.shapes) {
                    expect(shape.area).toBeDefined();

                    // making sure we can distinguish between Circle & Square
                    switch (shape.type) {
                        case "circle":
                            expect(shape.radius).toBeDefined();
                            break;

                        case "square":
                            expect(shape.length).toBeDefined();
                            break;
                    }
                }
            }
        } catch (error) {
            fail(error);
        } finally {
            done();
        }
    });
});
