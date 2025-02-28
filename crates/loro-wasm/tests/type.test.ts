import {
  LoroDoc,
  LoroList,
  LoroMap,
  LoroMovableList,
  LoroText,
  LoroTree,
  PeerID,
  Value,
} from "../bundler/index";
import { expect, expectTypeOf, test } from "vitest";

test("Container should not match Value", () => {
  const list = new LoroList();
  expectTypeOf(list).not.toMatchTypeOf<Value>();
});

test("A non-numeric string is not a valid peer id", () => {
  const doc = new LoroDoc();
  expectTypeOf(doc.peerIdStr).toMatchTypeOf<PeerID>();
  expectTypeOf("123" as const).toMatchTypeOf<PeerID>();
  expectTypeOf("a123" as const).not.toMatchTypeOf<PeerID>();
});

test("Expect container type", () => {
  const list = new LoroList();
  expectTypeOf(list.kind()).toMatchTypeOf<"List">();
  const map = new LoroMap();
  expectTypeOf(map.kind()).toMatchTypeOf<"Map">();
  const text = new LoroText();
  expectTypeOf(text.kind()).toMatchTypeOf<"Text">();
  const tree = new LoroTree();
  expectTypeOf(tree.kind()).toMatchTypeOf<"Tree">();
});

test("doc type and container type", () => {
  const doc = new LoroDoc<{
    text: LoroText;
    map: LoroMap<{
      name?: string;
      note?: LoroText;
      fav?: LoroList<string>;
      num?: LoroList<number>;
    }>;
  }>();

  const map = doc.getMap("map");
  expectTypeOf(map).toMatchTypeOf<
    LoroMap<{
      name?: string;
      note?: LoroText;
      fav?: LoroList<string>;
    }>
  >();
  expectTypeOf(map).toMatchTypeOf<LoroMap>();
  expectTypeOf(map).toMatchTypeOf<LoroMap<{ name?: string }>>();
  expectTypeOf(map).not.toMatchTypeOf<LoroMap<{ name: number }>>();
  expectTypeOf(map).not.toMatchTypeOf<LoroMap<{ a: number }>>();
  expectTypeOf(map.get("name")).toMatchTypeOf<string | undefined>();
  expectTypeOf(map.get("note")).toMatchTypeOf<LoroText | undefined>();
  expectTypeOf(map.get("fav")).toMatchTypeOf<LoroList<string> | undefined>();
  const list = map.setContainer("fav", new LoroList());
  expectTypeOf(list.toArray()).toMatchTypeOf<string[]>();
  const numList = map.setContainer("num", new LoroList());
  expectTypeOf(list.toArray()).toMatchTypeOf<string[]>();
});

test("fail on set/insert container", () => {
  const list = new LoroList();
  // list.insert(0, list); // should fail
  const map = new LoroMap();
  // map.set("a", list); // should fail
  map.setContainer("a", list); // should work
  const mList = new LoroMovableList();
  // mList.insert(0, list); // should fail
  // mList.set(0, list); // should fail
  mList.insertContainer(0, list); // should work
  mList.setContainer(0, list); // should work
});

test("batchImport type", () => {
  const doc = new LoroDoc();
  // doc.importBatch(["abc"]); // should fail
  doc.importBatch([]); // should work
});
