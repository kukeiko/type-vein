import { SourceTypeSymbol, SourceType, Property } from "../../../../src";
import { CanvasType } from "./canvas.type";

export class CircleType {
    [SourceTypeSymbol] = SourceType.createMetadata(CircleType);
    area = Property.create("area", Number, b => b.loadable(["optional"]));
    canvas = Property.create("canvas", CanvasType, b => b.loadable(["optional"]));
    radius = Property.create("radius", Number, b => b.loadable(["optional"]));
    type = Property.create("type", "circle" as "circle", b => b.loadable());
}
