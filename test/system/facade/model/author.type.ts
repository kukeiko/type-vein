import { SourceTypeSymbol, SourceType, Property } from "../../../../src";

export class AuthorType {
    [SourceTypeSymbol] = SourceType.createMetadata(AuthorType);
    id = Property.create("id", Number, b => b.loadable().filterable());
    name = Property.create("name", String, b => b.loadable(["optional"]).filterable());
}

