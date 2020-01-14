import { Primitive, Unbox } from "./lang";
import { Property } from "./property";
import { SourceType } from "./source-type";
import { TappedType, TappedTypeSymbol } from "./tapped-type";
import { Context } from "./context";

/**
 * * [outdated] A property of a selection.
 */
type TappedSourceTypeProperty<P extends Property, X = Property>
    = P["value"] extends Primitive ? P
    : Property.ReplaceValue<P, TapSourceType<Unbox<P["value"]>, X>>;

type TappedSourceTypeProperties<T extends SourceType, P = Property> = {
    [K in Property.Keys<T, P>]: TappedSourceTypeProperty<T[K], P>;
};

/**
 * [outdated] For a given type, take all properties that extend P. This is applied recursively onto expanded types.
 */
export type TapSourceType<T extends SourceType, P = Property>
    = TappedType<T>
    & TappedSourceTypeProperties<T, P>;

export module TapSourceType {
    // export function tap<ST extends SourceType, P extends Property = Property>(sourceType: ST, predicate: (p: Property) => p is P): TapSourceType<ST, P> {
    //     return {} as any;
    // }

    /**
     * [todo] find a way to make this method generic, i.e. via a predicate (but still return a properly typed TappedType)
     */
    export function tapRequiredInContext<ST extends SourceType, CTX extends Context>(sourceType: ST, context: CTX): TapSourceType<ST, Context.IsRequired<CTX>> {
        let requiredPrimitiveProperties = Property.pick(sourceType, p => Property.isPrimitive(p) && Context.has(p, context) && p[context].optional === false);
        let requiredExpandableProperties = Property.pick(sourceType, p => Property.isComplex(p) && Context.has(p, context) && p[context].optional === false);

        for (let k in requiredExpandableProperties) {
            let property = requiredExpandableProperties[k];

            let copy = {
                ...property,
                value: tapRequiredInContext(property.value instanceof Function ? new property.value() : property.value, context)
            };

            requiredExpandableProperties[k] = copy;
        }

        // [todo] cast to any required - this might indicate a type design issue
        let selectedType: TapSourceType<ST, Context.IsRequired<CTX>> = {
            [TappedTypeSymbol]: TappedType.createMetadata(sourceType),
            ...requiredPrimitiveProperties,
            ...requiredExpandableProperties
        } as any;

        return selectedType;
    }
}
