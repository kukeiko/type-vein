# query execution workflow
1) user instantiates a Query for a specific SourceType, i.e. let q = new CoffeeBeansQuery()
2) user picks the properties to be loaded (in case there are optional properties)
3) user applies Criteria (filtering, e.g. "where foo == 3 and bar > 8")
4) user is happy with their choices and instructs the Query to be executed against a Workspace
5) the Workspace reduces the Criteria against Criteria from previous Queries that are compatible with the property selection
6) if the Criteria are partially or not reduced at all, execute the Query and store the result with the executed Query into the cache
9) read from cache

## picking properties
The user can only pick properties that are marked as "optional". This feature exists for several use cases:
- OData $select, which supports whitelisting which properties/expansions of an entity are to be loaded
- OData $expand, which is basically an SQL table join to another entity (i.e. references & collections)
- custom "extra data" inclusion, i.e. the API supports additional data to be loaded for an entity

If the user didn't pick a property marked as optional it will not exist in the resulting entity instance.

## virtual properties
By using optional properties we can also implement virtual properties, i.e. properties that don't really exist on the server side data model, but can instead be resolved on the client.

Such a property could additionally be marked as nullable to signal when the hydration of the virtual property has failed (which is absolutely likely since virtual properties require additional http requests to the initial one).
