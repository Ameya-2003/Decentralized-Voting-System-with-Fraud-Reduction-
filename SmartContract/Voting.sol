// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// A smart contract for a blockchain voting system
contract Voting is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    // A struct to represent a candidate
    struct Candidate {
        uint256 id; // The candidate's ID
        string name; // The candidate's name
        uint256 voteCount; // The number of votes the candidate has
    }

    // A struct to represent a voter
    struct Voter {
        bool voted; // Whether the voter has voted or not
        uint256 vote; // The ID of the candidate the voter voted for
    }

    // A mapping to store the candidates by their ID
    mapping(uint256 => Candidate) public candidates;

    // A mapping to store the voters by their address
    mapping(address => Voter) public voters;

    // A mapping to store the signatures by their hash
    mapping(bytes32 => bool) public signatures;

    // An array to store the candidate IDs
    uint256[] public candidateIds;

    // An event to be emitted when a new candidate is added
    event CandidateAdded(uint256 id, string name);

    // An event to be emitted when a voter votes
    event Voted(address voter, uint256 candidateId);

    // A modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(owner() == msg.sender, "Only owner can call this function");
        _;
    }

    // A modifier to check if the voter has a valid signature
    modifier onlyValidSignature(bytes memory signature) {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender));
        address signer = hash.recover(signature);
        require(signer == owner(), "Invalid signature");
        require(!signatures[hash], "Signature already used");
        _;
    }

    // A function to add a new candidate
    function addCandidate(string memory name) public onlyOwner {
        uint256 id = candidateIds.length + 1;
        candidates[id] = Candidate(id, name, 0);
        candidateIds.push(id);
        emit CandidateAdded(id, name);
    }

    // A function to get the list of candidate IDs
    function getCandidateIds() public view returns (uint256[] memory) {
        return candidateIds;
    }

    // A function to get the details of a candidate by their ID
    function getCandidate(uint256 id)
        public
        view
        returns (Candidate memory)
    {
        require(candidates[id].id != 0, "Candidate does not exist");
        return candidates[id];
    }

    // A function to vote for a candidate by their ID
    function vote(uint256 id, bytes memory signature)
        public
        nonReentrant
        onlyValidSignature(signature)
    {
        require(!voters[msg.sender].voted, "Voter has already voted");
        require(candidates[id].id != 0, "Candidate does not exist");
        voters[msg.sender] = Voter(true, id);
        candidates[id].voteCount++;
        signatures[keccak256(abi.encodePacked(msg.sender))] = true;
        emit Voted(msg.sender, id);
    }

    // A function to get the winner of the election
    function getWinner() public view returns (Candidate memory) {
        require(candidateIds.length > 0, "No candidates");
        uint256 maxVotes = 0;
        uint256 winnerId = 0;
        for (uint256 i = 0; i < candidateIds.length; i++) {
            uint256 id = candidateIds[i];
            if (candidates[id].voteCount > maxVotes) {
                maxVotes = candidates[id].voteCount;
                winnerId = id;
            }
        }
        require(winnerId != 0, "No votes");
        return candidates[winnerId];
    }
}
