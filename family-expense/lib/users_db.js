import { connectToDatabase } from "./mongodb";

class User {

  //TODO: In general add strict type check before putting data into Mongo
  async createUserIfNotExist(data) {
    let { db } = await connectToDatabase();
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({email:data.email});
    if (user) {
        return String(user._id);
    }

    const result = await userCollection.insertOne(data);
    return result.insertedId;
  }
}

export default User