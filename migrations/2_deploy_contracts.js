"use strict";

const GithubHint = artifacts.require("./GithubHint.sol");

module.exports = deployer => {
  deployer.deploy(GithubHint);
};
