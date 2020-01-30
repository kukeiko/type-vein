import { Property } from "./property";
import { Context } from "./context";
import { Primitive, Unbox } from "./lang";

type SelectedValue<P extends Property, CTX extends Context>
    = P["value"] extends Primitive ? true
    : P["value"] extends any[] ? UnionSelection<Property.UnboxedValue<P>, CTX>
    : Selection<Property.UnboxedValue<P>, CTX>;

type UnionSelection<T, CTX extends Context> = T extends any ? Selection<T, CTX> : never;

export type Selection<ST, CTX extends Context = "loadable"> = {
    [K in Property.Keys<ST, Context.Has<CTX, any, true>>]?: SelectedValue<ST[K], CTX>;
};

type UntypedSelection = { [key: string]: true | UntypedSelection };

export function mergeSelections(...selections: UntypedSelection[]): UntypedSelection {
    const merged: UntypedSelection = {};

    for (const selection of selections) {
        for (const key in selection) {
            if (selection[key] === true) {
                merged[key] = true;
            } else if (merged[key] instanceof Object) {
                merged[key] = mergeSelections(merged[key] as UntypedSelection, selection[key] as UntypedSelection);
            } else {
                merged[key] = { ...selection[key] as UntypedSelection };
            }
        }
    }

    return merged;
}
