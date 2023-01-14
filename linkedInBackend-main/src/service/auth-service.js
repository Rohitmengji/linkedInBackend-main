const { User } = require("../models/users-model");
const userDal = require("../dal/users-dal");
const jwt = require("./jwt-service");

async function login(req, res) {
  //  Now find the user by their email address
  let user = await userDal.getUserByEmailId(req.body.email);

  if (!user) {
    return res.status(400).send("Incorrect email or password.");
  }

  // Then validate the Credentials in MongoDB match
  // those provided in the request
  const validPassword = req.body.password == user.password;
  if (!validPassword) {
    return res.status(400).send("Incorrect password.");
  }

  const token = await jwt.createJwtToken({ id: user._id });
  res.send({ token: token, userId: user._id });
}

async function register(req, res) {
  try {
    console.log("register data", req.body);
    const result = await userDal.insertUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ errorMessage: error.message });
  }
}


async function updateuserByUserId(req, res) {
 
  console.log("getPostForThisuserId", req.decodedToken.id);
  const user = await userDal.updateuserByUserId(req.decodedToken.id , req.body)
  res.send({"userId": req.decodedToken.id })
}

async function getAllUsers(req , res) {
  const users = await userDal.getAllUsers()
  res.send(users)
}

async function getUserByUserId(req,res) {
  const userId = req.params.userId
  const user = await userDal.getUserByUserId(userId)
  res.send(user)
}

module.exports = { login, register , updateuserByUserId , getAllUsers , getUserByUserId};
