// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('slowyounet');

// Create a new document in the collection.
db.getCollection('systemlog').insertOne(
    {
        "message": "This is a test log message",
        "timestamp": "2022-01-01T00:00:00.000Z"
      }
);
