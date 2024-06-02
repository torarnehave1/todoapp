use('slowyounet');



db.createCollection("personer", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "givenname", "familyname", "email", "phone", "organization"],
        properties: {
          name: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          givenname: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          familyname: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          email: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          phone: {
            bsonType: "string",
            description: "must be a string and is required"
          },
          organization: {
            bsonType: "string",
            description: "must be a string and is required"
          }
        }
      }
    }
  });