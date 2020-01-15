import { SourceType } from "./source-type";
import { Instance } from "./instance";
import { ObjectCriterion } from "./criteria";
import { Context } from "./context";
import { TappedType } from "./tapped-type";
import { Property } from "./property";
import { Primitive, Unbox } from "./lang";

export interface InstanceLoader<T extends SourceType> {
    load(loadable: InstanceLoader.Loadable<T>, criteria: ObjectCriterion.ForType<T>[]): Map<string | number, Instance<T, "loadable">>;
}

export module InstanceLoader {
    type LoadableProperty<P extends Property & Context.Has<C>, C extends Context>
        = P["value"] extends Primitive ? P[C]["optional"] extends true ? Context.ChangeOptional<P, C, boolean> : P
        : Property.ReplaceValue<P[C]["optional"] extends true ? Context.ChangeOptional<P, C, boolean> : P, Loadable<Unbox<P["value"]>>>;

    export type Loadable<ST extends SourceType>
        = TappedType<ST>
        & {
            [K in Property.Keys<ST, Context.IsRequired<"loadable">>]: LoadableProperty<ST[K], "loadable">;
        }
        & {
            [K in Property.Keys<ST, Context.IsOptional<"loadable">>]?: LoadableProperty<ST[K], "loadable">;
        };
}
