const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BankModule", (m) => {
  const bank = m.contract("SimpleBank");
  return { bank };
});