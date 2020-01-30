import { Instance, AliasedInstance } from "./instance";
import { SourceType, SourceTypeSymbol } from "./source-type";
import { Property } from "./property";
import { Context } from "./context";

class AlbumType {
    [SourceTypeSymbol] = SourceType.createMetadata(AlbumType);
    name = Property.create("name", String, "Name", b => b.creatable(["optional"]).loadable());
    releasedAt = Property.create("releasedAt", String, b => b.creatable().loadable());
    songs = Property.create("songs", SongType, b => b.iterable().creatable([]).loadable());
    author = Property.create("author", AuthorType, "Author", b => b.loadable().creatable(["optional"]));
}

class SongType implements SourceType<typeof SongType> {
    [SourceTypeSymbol] = SourceType.createMetadata(SongType);
    index = Property.create("index", Number, b => b.creatable(["nullable"]));
}

class AuthorType implements SourceType<typeof AuthorType> {
    [SourceTypeSymbol] = SourceType.createMetadata(AuthorType);
    name = Property.create("name", String, "Name", b => b.loadable().creatable());
    album: Property<"album", typeof AlbumType> = null as any;
    bornAt: Property<"releasedAt", typeof String> & Context.Has<"loadable"> = null as any;
}

let larifari: AliasedInstance<AlbumType, "creatable"> = {
    Name: void 0 || "foo",
    releasedAt: "2001",
    songs: [],
    Author: void 0 || {
        Name: "foo"
    }
};

let creatableInstance: Instance<AlbumType, "creatable"> = {
    name: true ? void 0 : "foo",
    releasedAt: "2001",
    songs: [],
    author: {
        name: "foo"
    }
};

/**
 * default instance issue
 */
class FooType {
    [SourceTypeSymbol] = SourceType.createMetadata(FooType);
    bar = Property.create("bar", String, b => b.loadable());
    baz = Property.create("bar", String, b => b.loadable(["optional"]));
}

function takesFooTypeInstance(instance: Instance<FooType, "loadable">): void {
    if (instance.baz !== void 0) {
        // do stuff
    }
}
