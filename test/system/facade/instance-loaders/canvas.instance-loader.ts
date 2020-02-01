import { InstanceLoader, Selection, Instance } from "../../../../src";
import { CanvasType, CircleType, SquareType } from "../model";

/**
 * A simple InstanceLoader for CanvasType that just returns 1 result.
 */
export const canvasInstanceLoader : InstanceLoader<CanvasType> = async query => {
    const queriedSelection = query.selection;
    const loadedSelection: Selection<CanvasType> = {};

    // instance with all baseline required properties
    let canvas: Instance<CanvasType> = {
        id: 1,
        name: "A Sun and a Square"
    };

    // include properties based on the queried selection
    if (queriedSelection.author) {
        canvas.author = { id: 7 };
        loadedSelection.author = {};

        if (queriedSelection.author.name) {
            canvas.author.name = "Susi Sonne";
            loadedSelection.author.name = true;
        }
    }

    if (queriedSelection.shapes) {
        const sunShape: Instance<CircleType> = { type: "circle" };
        const squareShape: Instance<SquareType> = { type: "square" };
        loadedSelection.shapes = {};

        // check selections for properties common across all shapes
        if (queriedSelection.shapes.area) {
            sunShape.area = Math.PI * 12;
            squareShape.area = 25;
            loadedSelection.shapes.area = true;
        }

        // check selections for properties only on circle shapes
        const circleSelection = queriedSelection.shapes as Selection<CircleType>;

        if (circleSelection.radius) {
            sunShape.radius = 12;
            (loadedSelection.shapes as Selection<CircleType>).radius = true;
        }

        // check selections for properties only on square shapes
        const squareSelection = queriedSelection.shapes as Selection<SquareType>;

        if (squareSelection.length) {
            squareShape.length = 5;
            (loadedSelection.shapes as Selection<SquareType>).length = true;
        }

        canvas.shapes = [sunShape, squareShape];
    }

    return {
        instances: [canvas],
        loadedSelection
    };
};
