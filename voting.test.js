// Import the required libraries and modules
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Use the describe function to group the tests
describe("Voting contract", function () {
  // Declare some variables to store the contract and accounts
  let Voting;
  let voting;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Use the beforeEach hook to deploy the contract before each test
  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract and assign it to the voting variable
    voting = await Voting.deploy();
    await voting.deployed();
  });

  // Write the test cases using the it function
  it("Should assign the total supply of tokens to the owner", async function () {
    // Get the owner balance and the total supply
    const ownerBalance = await voting.balanceOf(owner.address);
    const totalSupply = await voting.totalSupply();

    // Check that they are equal
    expect(ownerBalance).to.equal(totalSupply);
  });

  it("Should transfer tokens between accounts", async function () {
    // Transfer 50 tokens from owner to addr1
    await voting.transfer(addr1.address, 50);

    // Get the balances of both accounts
    const addr1Balance = await voting.balanceOf(addr1.address);
    const ownerBalance = await voting.balanceOf(owner.address);

    // Check that they are correct
    expect(addr1Balance).to.equal(50);
    expect(ownerBalance).to.equal(await voting.totalSupply() - 50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    // Get the initial owner balance
    const ownerBalance = await voting.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner (totalSupply tokens)
    await expect(voting.connect(addr1).transfer(owner.address, 1)).to.be
      .reverted;

    // Check that the owner balance hasn't changed
    expect(await voting.balanceOf(owner.address)).to.equal(ownerBalance);
  });

  it("Should update balances after transfers", async function () {
    // Get the initial balances of both accounts
    const ownerBalance = await voting.balanceOf(owner.address);
    const addr1Balance = await voting.balanceOf(addr1.address);

    // Transfer 100 tokens from owner to addr1
    await voting.transfer(addr1.address, 100);

    // Transfer another 50 tokens from owner to addr2
    await voting.transfer(addr2.address, 50);

    // Check that the balances are updated
    const newOwnerBalance = await voting.balanceOf(owner.address);
    const newAddr1Balance = await voting.balanceOf(addr1.address);
    const newAddr2Balance = await voting.balanceOf(addr2.address);

    expect(newOwnerBalance).to.equal(ownerBalance - 150);
    expect(newAddr1Balance).to.equal(addr1Balance + 100);
    expect(newAddr2Balance).to.equal(50);
  });

  it("Should allow owner to add candidates", async function () {
    // Add two candidates by the owner
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");

    // Get the candidate IDs
    const candidateIds = await voting.getCandidateIds();

    // Check that they are correct
    expect(candidateIds.length).to.equal(2);
    expect(candidateIds[0]).to.equal(1);
    expect(candidateIds[1]).to.equal(2);
  });

  it("Should not allow non-owner to add candidates", async function () {
    // Try to add a candidate by addr1
    await expect(voting.connect(addr1).addCandidate("Charlie")).to.be.reverted;
  });

  it("Should allow owner to authorize voters", async function () {
    // Get the owner's private key
    const ownerKey = owner.privateKey;

    // Generate a signature for addr1
    const hash = ethers.utils.keccak256(addr1.address);
    const signature = await ethers.utils.signMessage(hash, ownerKey);

    // Vote for candidate 1 by addr1 using the signature
    await voting.connect(addr1).vote(1, signature);

    // Check that the vote was counted
    const candidate = await voting.getCandidate(1);
    expect(candidate.voteCount).to.equal(1);
  });

  it("Should not allow unauthorized voters to vote", async function () {
    // Try to vote for candidate 1 by addr1 without a signature
    await expect(voting.connect(addr1).vote(1, "0x")).to.be.reverted;
  });

  it("Should not allow replay attacks", async function () {
    // Get the owner's private key
    const ownerKey = owner.privateKey;

    // Generate a signature for addr1
    const hash = ethers.utils.keccak256(addr1.address);
    const signature = await ethers.utils.signMessage(hash, ownerKey);

    // Vote for candidate 1 by addr1 using the signature
    await voting.connect(addr1).vote(1, signature);

    // Try to vote again using the same signature
    await expect(voting.connect(addr1).vote(1, signature)).to.be.reverted;
  });

  it("Should return the winner of the election", async function () {
    // Get the owner's private key
    const ownerKey = owner.privateKey;

    // Add two candidates by the owner
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");

    // Generate signatures for addr1 and addr2
    const hash1 = ethers.utils.keccak256(addr1.address);
    const signature1 = await ethers.utils.signMessage(hash1, ownerKey);
    const hash2 = ethers.utils.keccak256(addr2.address);
    const signature2 = await ethers.utils.signMessage(hash2, ownerKey);

    // Vote for candidate 1 by addr1 and addr2 using the signatures
    await voting.connect(addr1).vote(1, signature1);
    await voting.connect(addr2).vote(1, signature2);

    // Get the winner of the election
    const winner = await voting.getWinner();

    // Check that the winner is candidate 1
    expect(winner.id).to.equal(1);
    expect(winner.name).to.equal("Alice");
    expect(winner.voteCount).to.equal(2);
  });
});
