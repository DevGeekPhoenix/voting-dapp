// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Vote {
    uint256 public NextJsVotes = 0;
    uint256 public NuxtJsVotes = 0;
    uint16 constant MAX_COMMENT_LENGTH = 200;

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

    event CommentCreated(
        uint256 id,
        address author,
        string content,
        uint256 timestamp,
        bool voteForNextJs
    );

    mapping(address => Voter) public voters;
    mapping(address => Comment[]) public comments;

    Comment[] public allComments;

    modifier onlyOneVote() {
        require(!voters[msg.sender].hasVoted, "You can only vote once!");
        _;
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
            bytes(_comment).length <= MAX_COMMENT_LENGTH,
            "Comment is too long!"
        );
        require(
            voters[msg.sender].hasVoted,
            "You need to vote before commenting!"
        );

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

    function getCommentsByAddress(
        address _owner
    ) public view returns (Comment[] memory) {
        return comments[_owner];
    }

    function getAllComments() public view returns (Comment[] memory) {
        return allComments;
    }
}
