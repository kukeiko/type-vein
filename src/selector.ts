import { Context } from "./context";
import { Property } from "./property";
import { Unbox } from "./lang";
import { mergeSelections } from "./selection";

export class Selector<T, CTX extends Context, S extends {} = {}> {
    constructor(type: T, context: CTX, selection: S = {} as S) {
        this._type = type;
        this._context = context;
        this._selection = selection;
    }

    private readonly _type: T;
    private readonly _context: CTX;
    private _selection: S;

    select<P extends Property.Primitive>(
        select: (properties: T) => P
    ): Selector<T, CTX, S & Record<P["key"], true>>;

    select<P extends Property.Complex, O = {}>(
        select: (properties: T) => P,
        expand?: (selector: Selector<Property.UnboxedValue<P>, CTX>) => Selector<Property.UnboxedValue<P>, CTX, O>
    ): Selector<T, CTX, S & Record<P["key"], O>>;

    select<P extends Property.Complex, DT, O = {}>(
        select: (properties: T) => P,
        from: () => DT,
        expand: (selector: Selector<Unbox<DT>, CTX>) => Selector<Unbox<DT>, CTX, O>
    ): Selector<T, CTX, S & Record<P["key"], O>>;

    select(...args: any[]): any {
        if (args[0] instanceof Function) {
            const property = this._fetchProperty(args[0]);

            if (!Context.has(property, this._context)) {
                throw new Error(`expected property '${property.key}' to have context '${this._context}'`);
            }

            if (Property.isPrimitive(property)) {
                (this._selection as any)[property.key] = true;
            } else if (Property.isComplex(property)) {
                if (args.length === 1) {
                    (this._selection as any)[property.key] = (this._selection as any)[property.key] || {};
                } else {
                    let type: Object;
                    let expandFn: ((selector: Selector<any, CTX>) => Selector<any, CTX>) | undefined;

                    if (args.length === 3 && args[1] instanceof Function && args[2] instanceof Function) {
                        type = new (args[1]())();
                        expandFn = args[2];
                    } else if (property.value instanceof Array) {
                        // [todo] probably not 100% safe to just pick the first one
                        type = new property.value[0]();
                        expandFn = args[1];
                    } else {
                        type = new property.value();
                        expandFn = args[1];
                    }

                    const expanded = expandFn ? expandFn(new Selector(type, this._context)).build() : {};
                    (this._selection as any)[property.key] = mergeSelections((this._selection as any)[property.key], expanded);
                }
            } else {
                throw new Error(`arguments didn't match any overload signature`);
            }
        } else {
            throw new Error(`arguments didn't match any overload signature`);
        }

        return this;
    }

    build(): S {
        return this._selection;
    }

    private _fetchProperty(selectFromType: (type: T) => Property): Property {
        let property = selectFromType(this._type);

        if (!Property.is(property)) {
            throw new Error(`expected property selector to return a property, got '${property}' instead`);
        }

        return property;
    }
}
