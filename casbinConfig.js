// casbinConfig.js
const path = require("path");
const { newEnforcer } = require("casbin");
const { MongooseAdapter } = require("casbin-mongoose-adapter");

async function setupCasbin() {
  let adapter;

  try {
    const currentAdapter = await MongooseAdapter.newAdapter(
      process.env.MONGO_URL
    );
    adapter = currentAdapter;
  } catch (error) {
    return;
  }

  const modelConf = path.resolve(__dirname, "./model.conf");

  const enforcer = await newEnforcer(modelConf, adapter);
  return enforcer;
}

module.exports = setupCasbin;
