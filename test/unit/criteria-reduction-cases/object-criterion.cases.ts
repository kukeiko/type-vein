import { expectObjectCriterionReduction } from "./utils";
import { ValueCriterion } from "../../../src";

export function runObjectCriterionCases(): void {
    /**
     * [A] is a superset of itself
     */
    expectObjectCriterionReduction(
        "{ foo == 2, bar (in (3, 4) || == 7) } should completely reduce itself",
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.In.create([3, 4]), ValueCriterion.Equals.create(7)]
        },
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.In.create([3, 4]), ValueCriterion.Equals.create(7)]
        },
        null
    );

    /**
     * [A] is a superset of [B]
     */
    expectObjectCriterionReduction(
        "{ foo == 2 } should completely reduce { foo == 2, bar == 3 }",
        {
            foo: [ValueCriterion.Equals.create(2)]
        },
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.Equals.create(3)]
        },
        null
    );

    /**
     * [A] doesn't intersect with [B]
     */
    expectObjectCriterionReduction(
        "{ foo == 2 } should not reduce { foo == 3 }",
        {
            foo: [ValueCriterion.Equals.create(2)]
        },
        {
            foo: [ValueCriterion.Equals.create(3)]
        },
        "no-change"
    );

    /**
     * [A] is a subset of [B]
     */
    expectObjectCriterionReduction(
        "{ foo == 2, bar == 3 } should not reduce { foo == 2 }",
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.Equals.create(3)]
        },
        {
            foo: [ValueCriterion.Equals.create(3)]
        },
        "no-change"
    );

    /**
     * [A] shares criteria but still doesn't intersect with [B]
     */
    expectObjectCriterionReduction(
        "{ foo == 2, bar == 4 } should not reduce { foo == 2, bar == 3 }",
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.Equals.create(4)]
        },
        {
            foo: [ValueCriterion.Equals.create(2)],
            bar: [ValueCriterion.Equals.create(3)]
        },
        "no-change"
    );

    /**
     * [A] removes intersection with [B]
     */
    {
        expectObjectCriterionReduction(
            "{ foo == 2 } should reduce { foo in [1, 2], bar == 3 } to { foo == 1, bar == 3 }",
            {
                foo: [ValueCriterion.Equals.create(2)]
            },
            {
                foo: [ValueCriterion.In.create([1, 2])],
                bar: [ValueCriterion.Equals.create(3)]
            },
            {
                foo: [ValueCriterion.Equals.create(1)],
                bar: [ValueCriterion.Equals.create(3)]
            }
        );

        expectObjectCriterionReduction(
            "{ foo == 2, bar in [3, 4] } should reduce { foo in [1, 2], bar == 3 } to { foo == 1, bar == 3 }",
            {
                foo: [ValueCriterion.Equals.create(2)],
                bar: [ValueCriterion.In.create([3, 4])]
            },
            {
                foo: [ValueCriterion.In.create([1, 2])],
                bar: [ValueCriterion.Equals.create(3)]
            },
            {
                foo: [ValueCriterion.Equals.create(1)],
                bar: [ValueCriterion.Equals.create(3)]
            }
        );
    }
}
