import MongoDb from "@/lib/mongodb.js";
import User from "@/models/user";

export default async function findUser(req, res) {
  if (req.method === "POST") {
    try {
      await MongoDb();
      const { email } = await req.body;
      const UserExists = await User.findOne({ email }).select("_id");
      console.log("User:", UserExists);
      return res.json({ UserExists });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.json({ message: "User don't match" });
  }
}