import { Primitive, Unbox } from "./lang";
import { SourceType } from "./source-type";
import { TappedType } from "./tapped-type";
import { PropertyBuilder } from "./property-builder";

/**
 * [todo] i no longer remember why i added the P (boolean indicating if value V is a primitive) generic type.
 * ideally we can get rid of it cause it looks a bit weird.
 * 
 * on the other hand it is useful for quick runtime checking, since we don't have to check value against [Boolean, Number, String].
 * 
 * another alternative would be to implement it as an attribute.
 */
export interface Property<K extends string = string, V = any, A extends string = K, P = V extends Primitive ? true : false> {
    alias: A;
    key: K;
    primitive: P;
    value: V;
}

export module Property {
    export function pick<T extends SourceType | TappedType>(type: T, predicate: (p: Property) => boolean = () => true): Record<string, Property> {
        let fields: Record<string, Property> = {};

        for (let k in type) {
            let candidate = type[k];

            if (Property.is(candidate) && predicate(candidate)) {
                fields[k] = candidate;
            }
        }

        return fields;
    }

    export type AliasOf<P> = P extends Property ? P["alias"] : never;

    /**
     * The aliases of properties in T that optionally extend P.
     */
    export type Aliases<T, IS = Property> = Exclude<({
        [K in keyof T]: T[K] extends (Property & IS) ? AliasOf<T[K]> : never;
    })[keyof T], undefined>;

    /**
     * The keys in T that point to a Property optionally extending P.
     */
    export type Keys<T, IS = Property, ISNOT = never> = Exclude<({
        [K in keyof T]: T[K] extends ISNOT ? never : T[K] extends (Property & IS) ? K : never;
    })[keyof T], undefined>;

    /**
     * Takes a property P and exchanges its value with what is provided for V.
     */
    // export type Property.ReplaceValue<P extends Property, V> = Omit<P, "value"> & { value: V };
    export type ReplaceValue<P, V> = Omit<P, "value"> & { value: V };

    export type KeyOfAliased<T, A extends string> = { [K in keyof T]: T[K] extends Property & { alias: A } ? K : never; }[keyof T];

    export type Aliased<T, A extends string> = T[KeyOfAliased<T, A>] extends Property ? T[KeyOfAliased<T, A>] : never;

    export type Primitive<K extends string = string, V = any, A extends string = K> = Property<K, V, A, true>;

    export type UnboxedValue<P extends Property> = Unbox<Unbox<P["value"]>>;

    export function isPrimitive(p: any): p is Primitive {
        return is(p) && p.primitive === true;
    }

    export type Complex<K extends string = string, V = any, A extends string = K> = Property<K, V, A, false>;

    export function isComplex(p: any): p is Complex {
        return is(p) && p.primitive === false;
    }

    export function is(x?: any): x is Property {
        x = x || {};

        return typeof ((x as Property).key) === "string" && (x as Property).value != null;
    }

    export function create<K extends string, V, P extends Property<K, V> = Property<K, V>>(key: K, value: V, b?: (builder: PropertyBuilder<K, V>) => PropertyBuilder<K, V, K, P>): P;
    export function create<K extends string, V, A extends string, P extends Property<K, V, A> = Property<K, V, A>>(key: K, value: V, alias: A, b?: (builder: PropertyBuilder<K, V, A>) => PropertyBuilder<K, V, A, P>): P;
    export function create(...args: any[]): any {
        let key: string;
        /**
         * [todo] proper type (Primitive | SourceType) & arg type validation
         */
        let value: any;
        let alias: string;
        let build: (builder: PropertyBuilder<any, any>) => PropertyBuilder<any, any>;

        if (args.length >= 3 && typeof (args[0]) === "string" && typeof (args[2]) === "string") {
            key = args[0];
            value = args[1];
            alias = args[2];
            build = typeof (args[3]) === "function" ? args[3] : (builder => builder);
        } else if (args.length >= 2) {
            key = args[0];
            value = args[1];
            alias = key;
            build = typeof (args[2]) === "function" ? args[2] : (builder => builder);
        } else {
            throw new Error(`arguments didn't match any overload signature`);
        }

        return build(new PropertyBuilder(key, value, alias)).build();
    }

    /**
     * [note] commented it out for now due to premature user experience optimisation.
     * for now i'll just always call loadable() when defining a property.
     */
    // export function define<K extends string, V, P = Property<K, V>>(key: K, value: V): P & IsLoadable;
    // export function define<K extends string, V, P extends Property<K, V> = Property<K, V>>(key: K, value: V, b: (builder: PropertyBuilder<K, V>) => PropertyBuilder<K, V, P>): P extends IsLoadable<true, any, any> ? P : P & IsLoadable;

    // export function define(...args: any[]): any {
    //     let key = args[0] as string;
    //     let value = args[1];

    //     if (args.length === 2) {
    //         return new PropertyBuilder(key, value).loadable().build();
    //     } else {
    //         return args[2](new PropertyBuilder(key, value).loadable()).build();
    //     }
    // }
}
