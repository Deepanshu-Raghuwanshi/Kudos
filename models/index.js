const Kudos = require("./models/kudos");
const userModel = require("./models/user");

Kudos.belongsTo(userModel, { as: "givenBy", foreignKey: "givenBy" });
Kudos.belongsTo(userModel, { as: "givenTo", foreignKey: "givenTo" });
