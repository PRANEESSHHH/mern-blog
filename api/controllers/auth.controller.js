import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET="e6cb44d8dfcd75b2d2ce785b0c114de5cd6c781ec9ef2082b37e3b93944b8920c4dbd0c82a5709ddb34b2a5b19f3f9495d60b2ccb12b696527bec997b8f21bdb0f123db58e8f6545dba64d1d5698fa1e05985b61c8720e5ec7fdc3565061cc68a08018e5c8adeb7e22206c641062025b9b545eb9382b7800cea816450a205855e3c8871edb5667655ccade491c7665746da3381d6fe918449b850e5a579eb93280a74427067dfae3cae1ce841d48b0f04ce08f060636b7cece41cf4eb065bb8e64eea7003b40106f038ea44a34533dd0868087e38b53d2256338aa3e9ada1cafe4fac55bc0bcab612ab00bd86722cfcffe352b116081c4bf8e7474539ee884fb1389f3bb38742900f93fb114a8e2457347008d5afb96268cca67edc104dead4294fb379f95ed8a40a28779cfc1c47322d57fcd890c714a93a7bc1bcbc3d234b848997d83358029e1f62705da3ba6df160fff1f22a1f38f552fb876fb782255f7b9af8ccab8d2a6a555799217b5eb6218a5af26f2c85c09c0d5482412d05091e212ba791d8fe7df1ac0c1fea3c27f4a81e29626660ec220dcac5f9f08db31a9061d62ca4ef1de65593e576e050cfbb2d265cf6f586919010d5557d175ea1e7a954072d20210407093deadd95acdffaeb449fff20279da939a4a87d27c9cd7656dd7c7b0f44b622607dcd419a938ac2bda2fdebed1fd3492333513162ae2d2ab27"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
       JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
