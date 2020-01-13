/**
 * All the contexts a property can be in.
 *  - loadable: when the property exists on an instance that is loaded via a query
 *  - creatable: when the property exists on an instance that is to be created
 *  - patchable: when the property exists on an instance that serves as a patch to an existing entity
 */
export type Context
    = "creatable"
    | "loadable"
    | "patchable";

export module Context {
    /**
     * Metadata about if the value of a property in a given Context is nullable and/or required.
     */
    export interface Options<NULL extends boolean = false, OPT extends boolean = false> {
        /**
         * If the value of this property in this context can be set to null.
         */
        nullable: NULL;

        /**
         * If this property is required in this context.
         */
        optional: OPT;
    }

    /**
     * A property that exists in the given context.
     */
    export type Has<CTX extends Context, NULL extends boolean = any, OPT extends boolean = any> = Record<CTX, Options<NULL, OPT>>;

    /**
     * A property that exists in the given context and is required.
     */
    export type IsRequired<CTX extends Context> = Has<CTX, any, false>;

    /**
     * A property that exists in the given context and is optional.
     */
    export type IsOptional<CTX extends Context> = Has<CTX, any, true>;

    export type IsCreatable<NULL extends boolean = false, OPT extends boolean = false>
        = Has<"creatable", NULL, OPT>;

    export type IsLoadable<NULL extends boolean = false, OPT extends boolean = false>
        = Has<"loadable", NULL, OPT>;

    export type IsPatchable<NULL extends boolean = false, OPT extends boolean = false>
        = Has<"patchable", NULL, OPT>;

    export function has<CTX extends Context>(property: any, context: CTX): property is Has<CTX> {
        return typeof (property?.[context]) === "object";
    }

    export function set<T extends object, CTX extends Context, F extends (keyof Options)[] = never[]>(property: T, context: CTX, flags?: F)
        : Context.Has<CTX, IncludesOptionsKey<F, "nullable">, IncludesOptionsKey<F, "optional">> {
        let ctx: Context.Options<any, any> = {
            nullable: !!flags?.includes("nullable"),
            optional: !!flags?.includes("optional")
        };

        (property as any)[context] = ctx;

        return property as any;
    }

    export type IncludesOptionsKey<T extends string[], CTXOK extends keyof Context.Options> = undefined extends T ? false : CTXOK extends T[number] ? true : false;

    export type ChangeOptional<P extends Context.Has<CTX, any, any>, CTX extends Context, B extends boolean>
        = Omit<P, CTX> & Context.Has<CTX, P[CTX]["nullable"], B>;

    export type WidenValue<P, CTX extends Context, V>
        = (
            P extends Context.Has<CTX, true, true> ? V | null | undefined
            : P extends Context.Has<CTX, true, false> ? V | null
            : P extends Context.Has<CTX, false, true> ? V | undefined
            : V
        );
}
