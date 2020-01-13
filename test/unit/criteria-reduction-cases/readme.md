# Criteria Reduction
## Introduction
Reduction happens by taking two criteria and reducing one from another.
A criterion [A] can only reduce a criterion [B] if is either a superset or shares an intersection.

This is a required part for our future caching mechanism - when a query comes in, it'll probably have a filter (criterion) applied to it,
like "where id is in (1, 2)". If we've already loaded the entity where id == 1, we should only additionally load the entity with id == 2.

Therefore a criterion like { op: "==", value: 1 } should reduce a criterion { op: "in", values: [1, 2] } to { op: "==", value: 2 }.

- If a criterion completely reduces another (that is, the result of the reduction is null), we know that in the past we've already executed a query that matches that criterion.
Therefore a fully cached result for the query can be returned instead of making any http request.

- If a criterion only partially reduces another, we can make an http request with a reduced payload. Reduction with a partial intersection only works if at maximum one property criteria intersects.
A criterion { foo in (1, 2), bar in (3, 4) } can therefore not reduce another criterion { foo in (2, 3), bar in (4, 5) }.

## Criteria vs Criterion
In english, "criteria" is the plural of "criterion", so whenever we talk about multiple pieces of "criterion",
to be grammatically correct, we have to say "criteria".
I, nonetheless - for a lack of imagination - decided to use both terms to refer to two specific types:
- criterion: a single thing that describes a condition
- criteria: an array of "Criterion", combined with "or"

By trying to use short names I avoided something like "OrCombinedCriteria" as a type name.
If that is completely confusing we should find alternatives.
