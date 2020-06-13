// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("student").readOwn("profile").updateOwn("profile");

  ac.grant("tutor").readOwn("profile").updateOwn("profile").extend("student");

  ac.grant("admin")
    .extend("student")
    .extend("tutor")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
