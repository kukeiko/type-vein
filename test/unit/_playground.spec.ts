import { SourceType, Property, InstanceLoader, Query, Instance, SourceTypeSymbol, TappedTypeSymbol, TappedType, Context, TapSourceType, ObjectCriterion, ValueCriterion, ValueCriteria, Replace } from "../../src";

describe("playground", () => {
    it("playing with instance-loader", () => {
        class AlbumType {
            [SourceTypeSymbol] = SourceType.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["optional"]));
            releasedAt = Property.create("releasedAt", String, b => b.loadable());
            songs = Property.create("songs", SongType, b => b.loadable().iterable());
            artist = Property.create("songs", ArtistType, b => b.loadable(["optional"]).iterable());
        }

        class ArtistType {
            [SourceTypeSymbol] = SourceType.createMetadata(ArtistType);
            name = Property.create("name", String, b => b.loadable());
            age = Property.create("age", Number, b => b.loadable(["optional"]));
        }

        class SongType {
            [SourceTypeSymbol] = SourceType.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["optional", "nullable"]));
            duration = Property.create("duration", Number, b => b.loadable());
            name = Property.create("name", String, b => b.loadable());
        }

        function foo<F>(x?: any): x is F {
            return true;
        }

        let dumdidum = (x?: any): x is string => foo<string>(x) && foo<number>(x);

        let albumTypeInstanceLoader: InstanceLoader<AlbumType> = {
            load(loadable, criteria) {
                // expected to be false
                loadable.releasedAt.loadable.optional;
                loadable.songs.loadable.optional;
                loadable.songs.value.duration.loadable.optional;
                loadable.artist?.value.name.loadable.optional;

                // expected to be boolean
                loadable.name?.loadable.optional;
                loadable.artist?.loadable.optional;
                loadable.artist?.value.age?.loadable.optional;
                loadable.songs.value.album?.loadable.optional;

                loadable.songs?.value[TappedTypeSymbol].source[SourceTypeSymbol].class;

                new loadable[TappedTypeSymbol].source[SourceTypeSymbol].class();
                let metadata = loadable[TappedTypeSymbol].source[SourceTypeSymbol].class;
                loadable[TappedTypeSymbol].source[SourceTypeSymbol].class;
                loadable.songs?.value[TappedTypeSymbol].source;

                for (let k in loadable) {

                }

                return new Map([
                    [1, {

                    } as any]
                ]);
            }
        };

        let anyTypeInstanceLoader: InstanceLoader<AlbumType | SongType> = {
            load(loadable) {

                let metadata = loadable[TappedTypeSymbol].source[SourceTypeSymbol];

                if (metadata.class === AlbumType) {

                    new metadata.class().releasedAt.key;
                }
                // if (metadata.class === AlbumType) {

                // }
                // if (type[Blueprint.$Symbol].class === AlbumType) {
                //     // new type[Blueprint.$Symbol].class().
                // }

                return new Map([
                    [1, {
                        name: "foo"
                    }]
                ]);
            }
        };
    });

    it("playing with query", () => {
        // arrange
        class AlbumType {
            [SourceTypeSymbol] = SourceType.createMetadata(AlbumType);
            name = Property.create("name", String, b => b.loadable(["optional"]).filterable().unique());
            releasedAt = Property.create("releasedAt", String, b => b.loadable(["nullable", "optional"]).filterable());
            songs = Property.create("songs", SongType, b => b.loadable(["optional"]).iterable());
        }

        class SongType {
            [SourceTypeSymbol] = SourceType.createMetadata(SongType);
            album = Property.create("album", AlbumType, b => b.loadable(["optional"]));
            duration = Property.create("duration", Number, b => b.loadable(["nullable"]).filterable());
            name = Property.create("name", String, b => b.loadable().filterable());
        }

        let typeQuery = new Query(new AlbumType());

        let selectedType = typeQuery
            .include(s => s
                .select(s => s.name)
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
            .build();

        let instance: Instance<typeof selectedType["tappedType"], "loadable"> = {
            name: "foo",
            songs: [{
                duration: true ? null : 3,
                name: "foo",
                album: {
                    releasedAt: "2001"
                }
            }]
        };
    });

    it("playing with inheritance on data models", () => {
        class FileSystemNode implements SourceType<typeof FileSystemNode> {
            [SourceTypeSymbol] = SourceType.createMetadata(FileSystemNode);

            // common properties
            id = Property.create("id", String, "Id", b => b.loadable()
                .custom("folder", true as true)
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            name = Property.create("name", String, "Filename", b => b.loadable()
                .custom("folder", true as true)
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            // folder properties
            children = Property.create("children", FileSystemNode, "Children", b => b.loadable(["optional"]).iterable()
                .custom("folder", true as true)
            );

            // file properties
            size = Property.create("size", Number, "FileSizeInBytes", b => b.loadable(["optional"])
                .custom("file", true as true)
                .custom("audio", true as true)
                .custom("video", true as true)
                .custom("document", true as true)
                .custom("image", true as true)
            );

            // properties of audio/video files
            duration = Property.create("duration", Number, "Duration", b => b.loadable(["optional"])
                .custom("video", true as true)
                .custom("audio", true as true)
            );

            // properties of document files
            pages = Property.create("pages", Number, "Pages", b => b.loadable(["optional"])
                .custom("document", true as true)
            );

            // properties of image/video files
            height = Property.create("height", Number, "Height", b => b.loadable(["optional"])
                .custom("image", true as true)
                .custom("video", true as true)
            );

            width = Property.create("width", Number, "Width", b => b.loadable(["optional"])
                .custom("image", true as true)
                .custom("video", true as true)
            );
        }

        type MakePropertyRequired<P extends Context.Has<C>, C extends Context> = P[C]["optional"] extends true ? Context.ChangeOptional<P, C, false> : P;

        type MakePropertiesRequired<T extends SourceType, C extends Context, P = Property>
            = TappedType<T>
            & {
                [K in Property.Keys<T, P & Context.Has<C>>]: MakePropertyRequired<T[K], C>;
            };

        let fileSystemNodeInstance: Instance<FileSystemNode, "loadable"> = {
            id: "file-system-node-id",
            name: "the-file-system-node"
        };

        let folderInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { folder: true }>, "loadable"> = {
            id: "folder-id",
            name: "the-folder",
            children: []
        };

        let fileInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { file: true }>, "loadable"> = {
            id: "file-id",
            name: "the-file",
            size: 1337 * 1024 * 1024
        };

        let documentInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { document: true }>, "loadable"> = {
            id: "document-id",
            name: "the-document",
            pages: 64,
            size: 7 * 1024
        };

        let videoInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { video: true }>, "loadable"> = {
            id: "video-id",
            name: "the-video",
            duration: 543,
            height: 1080,
            width: 1920,
            size: 32 * 1024 * 1024
        };

        let audioInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { audio: true }>, "loadable"> = {
            id: "audio-id",
            name: "the-audio",
            duration: 123,
            size: 24 * 1024 * 1024
        };

        let imageInstance: Instance<MakePropertiesRequired<FileSystemNode, "loadable", { image: true }>, "loadable"> = {
            id: "image-id",
            name: "the-image",
            height: 640,
            width: 800,
            size: 1 * 1024 * 1024
        };
    });

    it("playing with entity-store", () => {
        class FooType {
            [SourceTypeSymbol] = SourceType.createMetadata(FooType);
        }
    });

    it("playing with criteria", () => {
        let criteriaA = [
            ValueCriterion.Equals.create(2),
            ValueCriterion.Equals.create(3)
        ];

        let criteriaB = [
            ValueCriterion.In.create([2, 3])
        ];

        // expect(InstanceCriteria.reduceSingleValueCriteria(criteriaA, criteriaB)).toEqual([Criterion.Equals.create(3)]);
        expect(ValueCriteria.reduce(criteriaA, criteriaB)).toBeNull();
    });
});