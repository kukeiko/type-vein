import { SourceType } from "./source-type";
import { Context } from "./context";
import { Attribute } from "./attribute";
import { Instance } from "./instance";
import { Property } from "./property";

type LocalOptionalKeys<ST extends SourceType, CTX extends Context> = Property.Keys<ST, Context.IsOptional<CTX>, Attribute.IsNavigable>;

export class EntitySet<T extends SourceType, CTX extends Context> {
    constructor(sourceType: T, context: CTX) {
        this.sourceType = sourceType;
    }

    readonly sourceType: T;
    private _instances: Instance<T, CTX, Property, Attribute.IsNavigable>[] = [];

    get(): Instance<T, CTX, Property, Attribute.IsNavigable>[] {
        return this._instances as any;
    }
}
