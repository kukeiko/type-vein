import { SourceType } from "./source-type";
import { TapSourceType } from "./tap-source-type";
import { Context } from "./context";
import { Attribute } from "./attribute";
import { Instance } from "./instance";
import { ObjectCriteria } from "./criteria";
import { Property } from "./property";
import { TappedType } from "./tapped-type";

type LocalOptionalKeys<ST extends SourceType, CTX extends Context> = Property.Keys<ST, Context.IsOptional<CTX>, Attribute.IsNavigable>;

export class EntitySet<ST extends SourceType, CTX extends Context> {
    constructor(sourceType: ST, context: CTX) {
        this.sourceType = sourceType;
    }

    readonly sourceType: ST;
    private _instances: Instance<TapSourceType<ST, {}, Attribute.IsNavigable>, CTX>[] = [];

    get<TT extends TappedType<ST>>(tappedType: TT): Instance<TT, CTX, {}, Attribute.IsNavigable>[] {
        return this._instances as any;
    }
}
