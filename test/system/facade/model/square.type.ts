import { SourceTypeSymbol, SourceType, Property } from "../../../../src";

export class SquareType {
    [SourceTypeSymbol] = SourceType.createMetadata(SquareType);
    area = Property.create("area", Number, b => b.loadable(["optional"]));
    length = Property.create("length", Number, b => b.loadable(["optional"]));
    type = Property.create("type", "square" as "square", b => b.loadable());
}
