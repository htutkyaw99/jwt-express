const express = require("express");
const jwt = require("jsonwebtoken");
// const { isAuthorize } = require("./middlewares/isAuth");

const app = express();

//accept req body
app.use(express.json());

const PORT = 8000;

const users = [
  {
    id: 1,
    username: "kyaw",
    password: "kyaw0123",
    isAdmin: true,
  },
  {
    id: 2,
    username: "aung",
    password: "aung0123",
    isAdmin: false,
  },
];

app.get("/", (req, res) => {
  res.json({
    message: "User List",
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (!user) {
    res.status(400).json({
      message: "Username or Password Incorrect",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
    },
    "naychi"
  );

  res.json({
    message: "Login Successfully!",
    data: user,
    token,
  });
});

const isAuthorize = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "naychi", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Your token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated" });
  }
};

app.delete("/api/users/:id", isAuthorize, (req, res) => {
  if (req.user.id == req.params.id || req.user.isAdmin) {
    return res.status(200).json({
      message: "Post deleted",
    });
  } else {
    return res.status(403).json({
      message: "You are not allowed to delete this post",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running");
});
