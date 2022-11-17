const express = require("express");
const userRouter = express.Router();

const controller = require("./../Controller/userController");

userRouter.route("/users")
    .get(controller.getAllUsers)
    .post(controller.addUser)
    .put(controller.updateUser)
    .delete(controller.deleteUser);

module.exports = userRouter;