"use strict";

const logger = require("../utils/logger");
const userstore = require('../models/user-store');
const accounts = require("./accounts.js");

const user = {
  
  index(request, response) {
    const userId = accounts.getCurrentUser(request);
 //   const userId = request.params.userid;
    logger.debug(`Attempting to edit user ${userId}`);
    const viewData = {
      title: "Edit User",
      user: userstore.getUserById(userId)
    };
    response.render("user", viewData);
  },
  
  update(request, response) {
    const userId = accounts.getCurrentUser(request);
    const user = userstore.getUserById(userId);
    const userChange = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password
    };
    logger.debug(`Updating the user ${userId}`);
    userstore.updateUser(user, userChange);
    response.redirect("/dashboard")
  }
  
};

module.exports = user;

