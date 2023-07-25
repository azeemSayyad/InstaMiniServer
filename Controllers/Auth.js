import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Modals/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      picturePath,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHashed,
      friends,
      picturePath,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "User not Exist" });

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    delete user.password;

    await User.findByIdAndUpdate(user._id, { active: true });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE_KEY);
    console.log(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logOut = async (req, res) => {
  try {
    console.log("logout");
    let id = req.params.id;
    let user = await User.findById(id);
    await User.findByIdAndUpdate(id, { active: false });
    res.status(200).json("Logged out successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json("User Not Found")
    }
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);
    await User.updateOne({ email: email }, { $set: {password:passwordHashed} });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({error})}
};
