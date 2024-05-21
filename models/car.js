import { db, closeDb } from "../config/database.js"
import { initCars } from "../config/initialData.js"

export class Cars {

  static async initializeCars() {
    // Drop and create collection with schema
    db.dropCollection('cars')
    await db.createCollection('cars',  {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          title: "Car Object Validation",
          required: [ "category", "model", "plate", "location" ],
          properties: {
            category: {bsonType: "string"}, // Foreign key
            model: {bsonType: "string"},
            plate: {bsonType: "string"},
            location: {bsonType: "string"},
          }
      }}
    })

    // Set primary key
    await db.collection('cars').createIndex({ plate: 1}, {unique: true})

    // Populate collection
    await db.collection('cars').insertMany(initCars)
    console.log("Successfully initialized cars collection!")
  }

  static async customFind(query, options) {
    return await db.collection('cars').find(query, options).toArray()
  }

  static async getAllCars() {
    const query = {}
    const options = { projection: {_id:0} }

    return await this.customFind(query, options)
  }

  static async getCarByPlate(plate) {
    return await db.collection('cars').findOne({plate: plate})
  }

  static async countCarsOfCategoryInLocation(category, location) {
    const filter = { category: category, location: location }
    return await db.collection('cars').countDocuments(filter)
  }

}


// If __name__ == main
if (process.argv[1] === import.meta.filename){
  await Cars.initializeCars().catch(console.dir)
  // Print the results in JSON format
  console.dir( await Cars.getAllCars().catch(console.dir) )
  await closeDb()
}
