// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("student")
        .readOwn("profile")
        .updateOwn("profile")

    ac.grant("school")
      .readOwn("profile")
          .updateOwn("profile")

    ac.grant("admin")
        .extend("student")
        .extend("school")
        .updateAny("profile")
        .deleteAny("profile")

    return ac;
})();