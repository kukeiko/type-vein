import { ValueCriterion } from "./value-criterion";
import { NotEqualsValueCriterion } from "./not-equals-value-criterion";

export interface EqualsValueCriterion {
    op: "==";
    value: boolean | number | string | null;
}

export module EqualsValueCriterion {
    export function create<V extends EqualsValueCriterion["value"]>(value: V): EqualsValueCriterion {
        return { op: "==", value: value };
    }

    /**
     * Make b smaller by reducing it by a.
     */
    export function reduce(a: EqualsValueCriterion, b: ValueCriterion): ValueCriterion | null {
        switch (b.op) {
            // case "custom": return b.reduceBy(a);
            case "==": return a.value === b.value ? null : b;
            case "!=": return a.value === b.value ? b : { op: "not-in", values: new Set([a.value, b.value]) };
            case "<=": return a.value === b.value ? { op: "<", value: a.value } : b;
            case ">=": return a.value === b.value ? { op: ">", value: a.value } : b;

            case "in":
                if (b.values.has(a.value)) {
                    if (b.values.size === 1) return null;

                    let copy = new Set(b.values);
                    copy.delete(a.value);

                    return copy.size === 1
                        ? { op: "==", value: copy.values().next().value }
                        : { op: "in", values: copy };
                } else {
                    return b;
                }

            case "not-in": return b.values.has(a.value) ? b : { op: "not-in", values: new Set([...b.values, a.value]) };

            case "from-to": {
                let from = b.from;
                let to = b.to;

                if (from.op === ">=" && from.value === a.value) {
                    if (to.op === "<=" && to.value === a.value) {
                        return null;
                    }

                    from = { op: ">", value: a.value };
                }

                if (to.op === "<=" && to.value === a.value) {
                    to = { op: "<", value: a.value };
                }

                return (from == b.from && to == b.to) ? b : { op: "from-to", from: from, to: to };
            }

            default: return b;
        }
    }
}
