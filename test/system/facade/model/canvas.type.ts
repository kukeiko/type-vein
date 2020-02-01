import { SourceTypeSymbol, SourceType, Property } from "../../../../src";
import { AuthorType } from "./author.type";
import { CircleType } from "./circle.type";
import { SquareType } from "./square.type";

export class CanvasType {
    [SourceTypeSymbol] = SourceType.createMetadata(CanvasType);
    id = Property.create("id", Number, b => b.loadable().filterable());
    author = Property.create("author", AuthorType, b => b.loadable(["optional"]));
    name = Property.create("name", String, b => b.loadable().filterable());
    shapes = Property.create("shapes", [CircleType, SquareType], b => b.loadable(["optional"]).iterable());
}
