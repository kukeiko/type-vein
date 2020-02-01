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

export type UntypedSelection = { [key: string]: true | UntypedSelection };

export module Selection {
    export function merge(...selections: UntypedSelection[]): UntypedSelection {
        const merged: UntypedSelection = {};

        for (const selection of selections) {
            for (const key in selection) {
                if (selection[key] === true) {
                    merged[key] = true;
                } else if (merged[key] instanceof Object) {
                    merged[key] = merge(merged[key] as UntypedSelection, selection[key] as UntypedSelection);
                } else {
                    merged[key] = { ...selection[key] as UntypedSelection };
                }
            }
        }

        return merged;
    }

    export function copy(selection: UntypedSelection): UntypedSelection {
        return merge(selection, {});
    }

    export function reduce(a: UntypedSelection, b: UntypedSelection): UntypedSelection | null {
        const reduced = copy(a);
        let didReduce = false;

        for (const key in b) {
            if (a[key] === void 0) {
                continue;
            } else if (b[key] === true) {
                delete (reduced[key]);
                didReduce = true;
            } else if (b[key] instanceof Object) {
                const subReduced = reduce(reduced[key] as UntypedSelection, b[key] as UntypedSelection);

                if (subReduced === null) {
                    delete (reduced[key]);
                    didReduce = true;
                } else if (subReduced === reduced[key]) {
                    continue;
                } else {
                    reduced[key] = subReduced;
                    didReduce = true;
                }
            }
        }

        if (!didReduce) {
            return a;
        } else if (Object.keys(reduced).length === 0) {
            return null;
        } else {
            return reduced;
        }
    }
}
