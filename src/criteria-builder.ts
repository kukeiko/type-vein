import { Property } from "./property";
import { Attribute } from "./attribute";
import { Context } from "./context";
import { Unbox } from "./lang";
import { ObjectCriteria } from "./criteria/object-criterion";

export class CriteraBuilder<T, C extends Context> {
    constructor(type: T) {
        this.type = type;
    }

    readonly type: T;

    equals<P extends Property.Primitive & Attribute.IsFilterable>(
        select: (properties: T) => P, value: Context.WidenValue<P, C, ReturnType<P["value"]>>
    ): this;

    equals(...args: any[]) {
        return this;
    }

    select<P extends Property.Complex>(
        select: (properties: T) => P,
        filter: (criteriaBuilder: CriteraBuilder<Unbox<P["value"]>, C>) => any
    ): this {
        return this;
    }

    build(): ObjectCriteria.ForType<T> {
        return [];
    }
}
