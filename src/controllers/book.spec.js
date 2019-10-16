const request = require("supertest");
const { MongoClient, ObjectId } = require("mongodb");
const { app } = require("../../dist/app");

describe("book controller)", () => {
  let connection;
  let db;
  let book;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db("library");
    book = await db.collection("books");
    await book.insertOne({
      title: "test-book",
      author: "test-author",
      medium: "physical",
      pageCount: 420,
      genre: "sci-fi",
    });
    await book.insertOne({
      _id: new ObjectId("5da780eebd37a52c192f4d0d"),
      title: "remove me",
      author: "mike",
      medium: "digital",
      pageCount: 69,
      genre: "comedy",
    });
  });

  afterEach(async () => {
    book = await db.collection("books");
    book.findOneAndDelete({ title: "test-book200" });
  });

  afterAll(async () => {
    book = await db.collection("books");
    await book.findOneAndDelete({ title: "test-book" });
    await book.findOneAndDelete({ title: "remove me" });

    connection.close();
  });

  it("should return code 422 wih error message", async () => {
    const res = await request(app).post("/library");
    expect(res.status).toEqual(422);
    let body = res.body;
    expect(body).toHaveProperty("error");
  });

  it("should reject malformed input", async () => {
    let badInput = { turtle: "not  a book", athr: "not an author" };
    const res = await request(app)
      .post("/library")
      .send(badInput);
    expect(res.status).toEqual(422);

    let body = res.body;

    expect(body).toHaveProperty("error");
  });

  it("should returns code 200 on success", async () => {
    const res = await request(app)
      .post("/library")
      .send({
        title: "test-book200",
        author: "test-author",
        medium: "physical",
        pageCount: 123,
        genre: "how-to",
      });
    expect(res.status).toEqual(200);
  });

  it("should reject duplicate copies", async () => {
    const res = await request(app)
      .post("/library")
      .send({
        title: "test-book",
        author: "test-author",
        medium: "physical",
        pageCount: 420,
        genre: "sci-fi",
      });
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual({
      code: 11000,
      driver: true,
      errmsg:
        'E11000 duplicate key error collection: library.books index: title_1 dup key: { title: "test-book" }',
      index: 0,
      keyPattern: { title: 1 },
      keyValue: { title: "test-book" },
      name: "MongoError",
    });
  });

  it("should return array of books", async () => {
    const res = await request(app).get("/library");

    expect(res.body.docs).toHaveLength(3);
  });

  it("should update a book with proper arguments", async () => {
    const res = await request(app)
      .post(`/library/${new ObjectId("5da780eebd37a52c192f4d0d")}`)
      .send({ currentPage: 20, url: 'qwerty' });
    
    const updated = await book.findOne({_id: new ObjectId("5da780eebd37a52c192f4d0d")})
    
    // console.log(updated)
    expect(updated.currentPage).toEqual(20)
    expect(updated.url).toEqual('qwerty')
  });

  it("should reject update with improper arguments", async () => {
    let badUpdateParams = {unsupported: 'parameter', other: 'unsupported parameter'}
    const res = await request(app)
    .post(`/library/${new ObjectId("5da780eebd37a52c192f4d0d")}`)
    .send(badUpdateParams);
    
    expect(res.status).toEqual(422)
  });

  it("should remove a book", async () => {
    const res = await request(app).delete(
      `/library/${new ObjectId("5da780eebd37a52c192f4d0d")}`
    );

    let removed = await book.findOne({ title: "remove me" });
    expect(removed).toBeNull();
  });
});
