import { Type, Property, InstanceLoader, TypeQuery, Instance, HasContext, TypeSymbol, SelectionSymbol, IsIterable, IsFilterable, IsUnique } from "../../src";

describe("instance-loader", () => {
    it("should do stuff", () => {
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name = Property.create("name", String);
            releasedAt = Property.create("releasedAt", String);
            songs = Property.create("songs", SongType, b => b.loadable().iterable());
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable());
            duration = Property.create("duration", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable());
        }

        let albumTypeInstanceLoader: InstanceLoader<AlbumType> = {
            load(loadable, criteria) {
                loadable.songs?.value[SelectionSymbol].type[TypeSymbol].class;

                new loadable[SelectionSymbol].type[TypeSymbol].class();
                let metadata = loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable[SelectionSymbol].type[TypeSymbol].class;
                loadable.songs?.value[SelectionSymbol].type;

                for (let k in loadable) {

                }

                return new Map([
                    [1, {}]
                ]);
            }
        };

        let anyTypeInstanceLoader: InstanceLoader<AlbumType | SongType> = {
            load(loadable) {
                let metadata = loadable[SelectionSymbol].type[TypeSymbol];

                if (metadata.class === AlbumType) {
                    new metadata.class().releasedAt.key;
                }
                // if (metadata.class === AlbumType) {

                // }
                // if (type[Blueprint.$Symbol].class === AlbumType) {
                //     // new type[Blueprint.$Symbol].class().
                // }

                return new Map([
                    [1, {}]
                ]);
            }
        };
    });
});

describe("type-query", () => {
    it("should do stuff", () => {
        // arrange
        class AlbumType {
            [TypeSymbol] = Type.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable().filterable().unique());
            releasedAt = Property.create("releasedAt", String, b => b.loadable(["nullable", "omittable", "voidable"]).filterable());
            songs = Property.create("songs", SongType, b => b.loadable().iterable());
        }

        class SongType {
            [TypeSymbol] = Type.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["omittable"]));
            duration = Property.create("duration", Number, b => b.loadable(["nullable"]).filterable());
            name = Property.create("name", String, b => b.loadable().filterable());
        }

        let typeQuery = new TypeQuery(new AlbumType());

        let selectedType = typeQuery
            .select(s => s
                .select(x => x.songs, s => s
                    .select(x => x.album, s => s
                        .select(x => x.releasedAt)
                    )
                )
            )
            .where(c => c
                .equals(x => x.name, "foo")
                .select(x => x.songs, c => c
                    .equals(x => x.duration, 120)
                    .equals(x => x.name, "foo")
                )
            )
            .where("or", c => c
                .equals(s => s.name, "quak")
                .select(s => s.songs, s => s.select(t => t.album, s => s.equals(t => t.releasedAt, true ? null : "2001")))
            )
            .build()
            ;


        let instance: Instance<typeof selectedType["selected"], "loadable"> = {
            name: "susi",
            songs: [{
                duration: true ? null : 3,
                name: "foo",
                album: {
                    releasedAt: true ? (true ? null : void 0) : "2001"
                }
            }]
        };

        // let filtersName = (cb: CriteraBuilder<SelectedType<AlbumType>>) => {
        //     cb.equals(x => x.name, "lala");
        //     cb.equals("foo", x => x.name);
        //     cb.equals("lala", x => x.name);
        // };
    });
});
