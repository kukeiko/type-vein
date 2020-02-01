import { ValueCriterion } from "./value-criterion";
import { StringIndexable } from "../../lang";

export type ValueCriteria = ValueCriterion[];

export module ValueCriteria {
    export function is(x?: any): x is ValueCriteria {
        return x instanceof Array && x.every(x => ValueCriterion.is(x));
    }

    export function pick(from: Record<string, any>): Record<string, ValueCriteria> {
        let picked: Record<string, ValueCriteria> = {};

        for (let k in from) {
            if (is(from[k])) {
                picked[k] = from[k];
            }
        }

        return picked;
    }

    export function reduce(a: ValueCriteria, b: ValueCriteria): ValueCriteria | null {
        let reduced = b.slice();
        let didReduce = false;

        for (let criterionA of a) {
            let nextReduced: ValueCriteria = [];

            for (let criterionB of reduced) {
                let reducedCriterion = ValueCriterion.reduce(criterionA, criterionB);

                if (reducedCriterion !== null) {
                    nextReduced.push(reducedCriterion);
                }

                if (reducedCriterion !== criterionB && !didReduce) {
                    didReduce = true;
                }
            }

            reduced = nextReduced;
        }

        if (didReduce) {
            return reduced.length > 0 ? reduced : null;
        } else {
            return b;
        }
    }

    export function filter<T extends StringIndexable>(instances: T[], key: string, criteria: ValueCriteria): T[] {
        const filtered = new Set<T>();

        for (const criterion of criteria) {
            let matches: (instance: T) => boolean = () => false;

            switch (criterion.op) {
                case "==": matches = instance => instance[key] === criterion.value; break;
                case "in": matches = instance => criterion.values.has(instance[key]); break;
                default: throw new Error(`criterion op '${criterion.op}' not yet supported`);
            }

            for (const instance of instances) {
                if (matches(instance)) {
                    filtered.add(instance);
                }
            }
        }

        return Array.from(filtered.values());
    }
}
