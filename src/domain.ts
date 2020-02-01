

import { Selection } from "./selection";
import { Instance } from "./instance";
import { Query } from "./query";
import { SourceType } from "./source-type";

export interface LoadedInstances<T extends SourceType, S> {
    instances: Instance.Selected<T, S>[];
    loadedSelection: Selection<T>;
}

export module LoadedInstances {
    export interface Untyped {
        instances: any[];
        loadedSelection: Object;
    }
}

export type InstanceLoader<T extends SourceType> = <S extends Selection<T>>(query: Query<T, S>) => Promise<LoadedInstances.Untyped>;
export type HydrationQueryFactory<T extends SourceType> = <S extends Selection<T>>(query: Query<T, S>) => [];

export class Domain {
    private readonly _loaders = new Map<any, InstanceLoader<any>>();

    // load<T extends SourceType, S>(query: Query<T, S>): Instance.Selected<T, S>[] {
    load<T extends SourceType, S>(query: Query<T, S>): LoadedInstances<T, S> {
        const loader = this._loaders.get(query.type);

        if (loader === void 0) {
            throw new Error(`no loader found for queried type`);
        }

        return (loader)(query) as any as LoadedInstances<T, S>;
    }

    addLoader<T extends SourceType>(type: T, loader: InstanceLoader<T>): this {
        this._loaders.set(type, loader);
        return this;
    }

    addHydrator(): this {

        return this;
    }
}
