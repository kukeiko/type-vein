import { Property } from "./property";
import { Unbox } from "./lang";
import { SourceType } from "./source-type";
import { Context } from "./context";
import { TapSourceType } from "./tap-source-type";

export type DefaultSourceTypeTap<ST extends SourceType, CTX extends Context> = TapSourceType<ST, Context.IsRequired<CTX>>;

export class SourceTypeTapper<ST extends SourceType, CTX extends Context, TT = DefaultSourceTypeTap<ST, CTX>> {
    constructor(type: ST, context: CTX) {
        if (!SourceType.is(type)) {
            throw new Error(`expected argument 'type' to be a SourceType`);
        }

        this._type = type;
        this._context = context;

        // [todo] cast to any required - this might indicate a type design issue
        this._selected = TapSourceType.tapRequiredInContext(type, context) as any;
    }

    private readonly _type: ST;
    private readonly _context: CTX;
    private readonly _selected: TT;

    // [todo] no longer sure why there is an Omit<S, P["key"]> 
    select<P extends Property.Primitive & Context.IsOptional<CTX>>(
        select: (properties: ST) => P
    ): SourceTypeTapper<ST, CTX, Omit<TT, P["key"]> & Record<P["key"], Context.ChangeOptional<P, CTX, false>>>;

    // [todo] no longer sure why there is an Omit<S, P["key"]> 
    select<P extends Property.Complex & Context.Has<CTX>, ETT = DefaultSourceTypeTap<Unbox<P["value"]>, CTX>>(
        select: (properties: ST) => P,
        expand?: (selector: SourceTypeTapper<Unbox<P["value"]>, CTX>) => SourceTypeTapper<Unbox<P["value"]>, CTX, ETT>
    ): SourceTypeTapper<ST, CTX, Omit<TT, P["key"]> & Record<P["key"], Property.ReplaceValue<Context.ChangeOptional<P, CTX, false>, ETT>>>;

    select(...args: any[]): any {
        if (args[0] instanceof Function) {
            let property = this._fetchProperty(args[0]);

            if (Property.isPrimitive(property)) {
                if (!Context.has(property, this._context)) {
                    throw new Error(`expected property '${property.key}' to have context '${this._context}'`);
                }

                if (property[this._context].optional === false) {
                    throw new Error(`expected property '${property.key}' to be optional for context '${this._context}'`);
                }

                this._selectProperty(property);
            } else if (Property.isComplex(property)) {
                if (!Context.has(property, this._context)) {
                    throw new Error(`expected property '${property.key}' to have context '${this._context}'`);
                }

                let type = this._getExpandableType(property);
                let expand: (selector: SourceTypeTapper<any, any>) => SourceTypeTapper<any, any> = args[1] || (q => q);
                let expandedType = expand(new SourceTypeTapper(type, this._context)).build();
                this._selectProperty(property, expandedType);
            } else {
                throw new Error(`arguments didn't match any overload signature`);
            }
        } else {
            throw new Error(`arguments didn't match any overload signature`);
        }

        return this;
    }

    private _fetchProperty(selectFromType: (type: ST) => Property): Property {
        let property = selectFromType(this._type);

        if (!Property.is(property)) {
            throw new Error(`expected property selector to return a property, got '${property}' instead`);
        }

        return property;
    }

    private _getExpandableType(property: Property): SourceType {
        return property.value instanceof Function ? new property.value() : property.value;
    }

    private _selectProperty(property: Property & Context.Has<CTX>, newValue?: any): void {
        let copy = { ...property };

        if (newValue !== void 0) {
            copy.value = newValue;
        }

        copy[this._context].optional = false;

        (this._selected as any)[property.key] = copy;
    }

    build(): TT {
        return this._selected;
    }
}
