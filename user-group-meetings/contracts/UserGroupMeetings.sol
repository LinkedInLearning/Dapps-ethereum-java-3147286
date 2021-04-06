pragma solidity ^0.8.2;

contract UserGroupMeetings {

    string[] public meetings;
    mapping(uint => address[]) public reservations;
    mapping(uint => mapping(address => bool)) public reservationsLookup;

    mapping(address => uint) public balances;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    function getMeetings() public view returns (string[] memory) {
        return meetings;
    }

    function addMeeting(string calldata m) public {
        meetings.push(m);
    }

    function bookReservation(uint i) public {
        bool reserved = reservationsLookup[i][msg.sender];

        if (!reserved) {
            reservations[i].push(msg.sender);
            reservationsLookup[i][msg.sender] = true;
        }
    }

    function getReservations(uint i) public view returns (address[] memory) {
        return reservations[i];
    }

    function confirmAttendance(uint i, address attendee) public {
        require(msg.sender == owner);
        require(reservationsLookup[i][attendee]);
        balances[attendee] += 10;
    }

}