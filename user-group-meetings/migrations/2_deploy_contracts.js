const UserGroupMeetings = artifacts.require("UserGroupMeetings");

module.exports = function (deployer) {
  deployer.deploy(UserGroupMeetings);
};
