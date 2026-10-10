const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleBank", function () {
  async function deployBank() {
    const [owner, other] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("SimpleBank");
    const bank = await Bank.deploy();
    return { bank, owner, other };
  }

  it("accepts deposits and tracks each account separately", async function () {
    const { bank, owner, other } = await deployBank();
    const deposit = ethers.parseEther("1");

    await bank.deposit({ value: deposit });
    await bank.connect(other).deposit({ value: ethers.parseEther("0.5") });

    expect(await bank.balances(owner.address)).to.equal(deposit);
    expect(await bank.connect(other).getBalance()).to.equal(ethers.parseEther("0.5"));
  });

  it("rejects zero deposits", async function () {
    const { bank } = await deployBank();
    await expect(bank.deposit({ value: 0 })).to.be.revertedWith("Deposit must be > 0");
  });

  it("withdraws only the caller's deposited funds", async function () {
    const { bank, owner, other } = await deployBank();
    const deposit = ethers.parseEther("1");
    const withdrawal = ethers.parseEther("0.4");

    await bank.deposit({ value: deposit });
    await expect(bank.connect(other).withdraw(withdrawal)).to.be.revertedWith("Insufficient funds");

    await expect(bank.withdraw(withdrawal))
      .to.changeEtherBalances([owner, bank], [withdrawal, -withdrawal]);
    expect(await bank.balances(owner.address)).to.equal(deposit - withdrawal);
  });

  it("rejects zero withdrawals", async function () {
    const { bank } = await deployBank();
    await expect(bank.withdraw(0)).to.be.revertedWith("Withdrawal must be > 0");
  });
});
