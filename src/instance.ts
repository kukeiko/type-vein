import { Primitive, Unbox } from "./lang";
import { Property } from "./property";
import { Attribute } from "./attribute";
import { Context } from "./context";

export type BoxPropertyValue<P, V> = P extends Attribute.IsIterable ? V[] : V;

export type UnionInstance<U, CTX extends Context = "loadable", IS = Property, ISNOT = never> = U extends any ? Instance<U, CTX, IS, ISNOT> : never;

export type InstancedValueOfProperty<P, CTX extends Context, IS, ISNOT, EXP = {}>
    = P extends Property ?
    P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : P["value"] extends string ? P["value"]
    : P["value"] extends number ? P["value"]
    : P["value"] extends any[] ? BoxPropertyValue<P, UnionInstance<Unbox<Unbox<P["value"]>>, CTX, IS, ISNOT>>
    : BoxPropertyValue<P, Instance<Unbox<P["value"]>, CTX, IS, ISNOT, EXP>>
    : never;

export type WidenedInstancedValueOfProperty<P, CTX extends Context, EXP = {}>
    = Context.WidenValue<P, CTX, InstancedValueOfProperty<P, CTX, Property, never, EXP>>;

export type ExpandedKeys<EXP> = Exclude<({
    [K in keyof EXP]: true extends EXP[K] ? K : never;
})[keyof EXP], undefined>;

export type Instance<T, CTX extends Context = "loadable", IS = Property, ISNOT = never, EXP = {}>
    = {
        [K in Property.Keys<T, Context.IsRequired<CTX> & IS>]: Context.WidenValue<T[K], CTX, InstancedValueOfProperty<T[K], CTX, IS, ISNOT>>;
    } & {
        [K in Property.Keys<T> & keyof EXP]: Exclude<WidenedInstancedValueOfProperty<T[K], CTX, EXP[K]>, undefined>;
    } & {
        [K in Exclude<Property.Keys<T, Context.IsOptional<CTX> & IS>, keyof EXP>]?: Context.WidenValue<T[K], CTX, InstancedValueOfProperty<T[K], CTX, IS, ISNOT>>;
    };

export type AliasedInstancedValueOfProperty<P extends Property, CTX extends Context>
    = P["value"] extends Primitive ? BoxPropertyValue<P, ReturnType<P["value"]>>
    : BoxPropertyValue<P, AliasedInstance<Unbox<P["value"]>, CTX>>;

export type AliasedInstance<T, CTX extends Context>
    = {
        [K in Property.Aliases<T, Context.IsRequired<CTX>>]: Context.WidenValue<Property.Aliased<T, K>, CTX, AliasedInstancedValueOfProperty<Property.Aliased<T, K>, CTX>>;
    } & {
        [K in Property.Aliases<T, Context.IsOptional<CTX>>]?: Context.WidenValue<Property.Aliased<T, K>, CTX, AliasedInstancedValueOfProperty<Property.Aliased<T, K>, CTX>>;
    };
