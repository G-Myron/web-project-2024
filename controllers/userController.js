import { UsersCollection } from "../config/database_users.js"

export class UserController {
  static async getAllUsers() {
    return await UsersCollection.getAllUsers()
  }
  static async getUserDetails(email) {
    return await UsersCollection.getUserDetails(email)
  }

  static async handleLogin(email, password) {
    const passwordDb = await UsersCollection.getPassword(email)
    return passwordDb === password
  }
}

