import User from "../models/User.js";
import fs from "fs/promises";
import HttpError from "../helpers/httpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import "dotenv/config.js";
import gravatar from "gravatar";
const { JWT_SECRET } = process.env;
import Jimp from "jimp";

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, `${email} already in use`);
  }
  const hashPassword = await bcrypt.hash(password, 10);

  let avatarURL;

  if (req.file) {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    avatarURL = path.join("public", "avatars", filename);
  } else {
    avatarURL = gravatar.url(email, { s: "250" });
  }
  console.log(avatarURL);

  const newUser = await User.create({
    ...req.body,
    avatarURL,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });

  res.status(204).json({
    message: "No Content",
  });
};

const changeAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, `Missed requiered fields`);
  }
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  const avatarURL = path.join("public", "avatars", filename);
  const image = await Jimp.read(oldPath);
  image.resize(250, 250);
  await image.writeAsync(newPath);
  await fs.unlink(oldPath);

  await User.findOneAndUpdate(req.user._id, avatarURL);

  res.status(200).json({
    avatarURL: avatarURL,
  });
};
export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeAvatar: ctrlWrapper(changeAvatar),
};
