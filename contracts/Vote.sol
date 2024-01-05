// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract Vote {
    uint256 public NextJsVotes = 0;
    uint256 public NuxtJsVotes = 0;
    uint16 private constant MAX_COMMENT_LENGTH = 100;
    uint8 private constant MAX_BLOCKS_PER_MINUTE = 4;
    uint8 private constant MIN_BLOCKS_PER_MINUTE = 3;
    uint256 private votingDeadline;
    address private _owner;
    uint256 private lastBlockNumber;
    uint256 private lastTimestamp;

    constructor(uint256 _votingDuration) {
        _owner = msg.sender;
        votingDeadline = block.timestamp + _votingDuration;
        lastBlockNumber = block.number;
        lastTimestamp = block.timestamp;
    }

    struct Comment {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        bool isForNextJs;
    }

    struct Voter {
        bool hasVoted;
        bool voteForNextJs;
    }

    event NewVoteSubmitted(address indexed voter, bool voteForNextJs);
    event VotingDeadlineExtended(uint256 newDeadline);
    event CommentCreated(
        uint256 id,
        address indexed author,
        string content,
        uint256 timestamp,
        bool voteForNextJs
    );

    mapping(address => Voter) public voters;
    mapping(address => Comment[]) public comments;
    Comment[] public allComments;

    modifier checkBlocksAndTime() {
        require(
            block.timestamp >= lastTimestamp + 1 minutes,
            "Less than a minute"
        );
        uint256 blocksPassed = block.number - lastBlockNumber;
        require(
            blocksPassed >= MIN_BLOCKS_PER_MINUTE &&
                blocksPassed <= MAX_BLOCKS_PER_MINUTE,
            "Block count out of range"
        );
        require(block.timestamp < votingDeadline, "Voting deadline passed");
        _;
        lastBlockNumber = block.number;
        lastTimestamp = block.timestamp;
    }

    modifier onlyOneVote() {
        require(!voters[msg.sender].hasVoted, "Already voted");
        _;
    }

    modifier onlyTheOwner() {
        require(msg.sender == _owner, "Unauthorized: not owner");
        _;
    }

    function setVotingDeadline(uint256 newDeadline) public onlyTheOwner {
        require(newDeadline > block.timestamp, "Deadline in the past");
        votingDeadline = newDeadline;
        emit VotingDeadlineExtended(newDeadline);
    }

    function vote(bool isForNextJs) external onlyOneVote {
        if (isForNextJs) {
            NextJsVotes++;
        } else {
            NuxtJsVotes++;
        }
        voters[msg.sender] = Voter(true, isForNextJs);
        emit NewVoteSubmitted(msg.sender, isForNextJs);
    }

    function createComment(string memory _comment) public {
        require(
            bytes(_comment).length > 0 &&
                bytes(_comment).length <= MAX_COMMENT_LENGTH,
            "Invalid comment length"
        );
        require(voters[msg.sender].hasVoted, "Must vote first");

        Comment memory newComment = Comment({
            id: comments[msg.sender].length,
            author: msg.sender,
            content: _comment,
            timestamp: block.timestamp,
            isForNextJs: voters[msg.sender].voteForNextJs
        });
        comments[msg.sender].push(newComment);
        allComments.push(newComment);

        emit CommentCreated(
            newComment.id,
            newComment.author,
            newComment.content,
            newComment.timestamp,
            newComment.isForNextJs
        );
    }

    function getVotes() public view returns (uint256[2] memory) {
        return [NextJsVotes, NuxtJsVotes];
    }

    function getCommentsByVoter(
        address voter
    ) public view returns (Comment[] memory) {
        return comments[voter];
    }

    function getAllComments() public view returns (Comment[] memory) {
        return allComments;
    }

    function timeLeftForVoting() public view returns (uint256) {
        return
            block.timestamp >= votingDeadline
                ? 0
                : votingDeadline - block.timestamp;
    }
}
