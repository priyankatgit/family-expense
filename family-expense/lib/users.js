import dbConnect from "../lib/mongodb";
import { User as UserModel } from "../models/Entry"; //TODO: Resolve User class name and model name ambiguity

class User {
  async createUserIfNotExist(data) {
    try {
      await dbConnect();
  
      let user = await UserModel.findOne({ email: data.email });
      if (user) {
        return String(user._id);
      }
  
      user = await UserModel.create(data);
      return user._id;
    } catch (error) {
      throw error
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export { User };