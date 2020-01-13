import { EqualsValueCriterion } from "./equals-value-criterion";
import { GreaterEqualsValueCriterion } from "./greater-equals-criterion";
import { LessValueCriterion } from "./less-value-criterion";
import { LessEqualsValueCriterion } from "./less-equals-value-criterion";
import { NotEqualsValueCriterion } from "./not-equals-value-criterion";
import { NotInValueCriterion } from "./not-in-value-criterion";
import { GreaterValueCriterion } from "./greater-value-criterion";
import { InValueCriterion } from "./in-value-criterion";
import { FromToValueCriterion } from "./from-to-value-criterion";

// [todo] rename to "SingleValueCriterion" cause just "ValueCriterion" is confusing, sounds like its a Union of "(SingleValue)ValueCriterion" and "SetCriterion" and "ObjectCriterion"
export type ValueCriterion
    = EqualsValueCriterion
    | FromToValueCriterion
    | GreaterEqualsValueCriterion
    | GreaterValueCriterion
    | InValueCriterion
    | LessValueCriterion
    | LessEqualsValueCriterion
    | NotEqualsValueCriterion
    | NotInValueCriterion;

export module ValueCriterion {
    export import Equals = EqualsValueCriterion;
    export import FromTo = FromToValueCriterion;
    export import GreaterEquals = GreaterEqualsValueCriterion;
    export import Greater = GreaterValueCriterion;
    export import In = InValueCriterion;
    export import Less = LessValueCriterion;
    export import LessEquals = LessEqualsValueCriterion;
    export import NotEquals = NotEqualsValueCriterion;
    export import NotIn = NotInValueCriterion;

    const operations: Record<ValueCriterion["op"], true> = {
        "!=": true, "<": true, "<=": true, "==": true, ">": true, ">=": true, "from-to": true, "not-in": true, in: true
    };

    const operationsSet = new Set(Object.keys(operations));

    export function is(x?: any): x is ValueCriterion {
        return operationsSet.has(x?.op);
    }

    export function reduce(a: ValueCriterion, b: ValueCriterion): ValueCriterion | null {
        return reducer(a.op)(a, b);
    }

    export function reducer<OP extends ValueCriterion["op"]>(op: OP): (a: Extract<ValueCriterion, { op: OP }>, b: ValueCriterion) => ValueCriterion | null {
        switch (op) {
            case "==": return Equals.reduce as any;
            case "!=": return NotEquals.reduce as any;
            case "<=":
            case "<":
            case ">=":
            case ">":
            case "in": return In.reduce as any;
            case "not-in":
            case "from-to":
            default: throw new Error(`no reducer available for operation '${op}'`);
        }
    }
}
