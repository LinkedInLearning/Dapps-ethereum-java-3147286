import Web3 from "web3";
import userGroupArtifact from "../../build/contracts/UserGroupMeetings.json";

const App = {
    web3: null,
    account: null,
    userGroup: null,

    start: async function() {
        const { web3 } = this;

        try {
            const networkId = await web3.eth.net.getId();
            const deployedInNetwork = userGroupArtifact.networks[networkId];
            this.userGroup = new web3.eth.Contract(userGroupArtifact.abi, deployedInNetwork.address);
            
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

            this.refreshBalance();
            this.refreshMeetings();

        } catch (error) {
            console.error("Could not connect to contract");
            console.error(error);
        }
    },

    refreshBalance: async function() {
        const { balances } = this.userGroup.methods;
        const balance = await balances(this.account).call();
        $("#balance").html(balance)
    },

    addMeeting: async function() {
        const meetingName = $("#new_meeting").val();
        this.setStatus("Initiating transaction...");

        const { addMeeting } = this.userGroup.methods;

        await addMeeting(meetingName).send({from: this.account});
        this.setStatus("Transaction complete!");
        this.refreshMeetings();
    },

    refreshMeetings: async function() {
        const { getMeetings, getReservations } = this.userGroup.methods;
        const meetings = await getMeetings().call();

        $("#meeting_list").html("");

        for (var i in meetings) {
            const reservations = await getReservations(i).call();
            const reservationList = '<ul class="list-group"><li class="list-group-item">'
            + reservations.join('</li><li class="list-group-item">') + "</li></ul>";

            $("#meeting_list").append("<li class='list-group-item'>" + meetings[i] + reservationList + "</li>");
        }
    },

    bookReservation: async function() {
        const meetingId = $("#reservation_meeting").val();
        this.setStatus("Initiating transaction...");

        const { bookReservation } = this.userGroup.methods;

        await bookReservation(meetingId).send({from: this.account});

        this.setStatus("Transaction complete!");
        this.refreshMeetings();

    },

    confirmAttendance: async function() {
        const meetingId = $("#attendance_meeting_id").val();
        const attendee = $("#attendee").val();

        this.setStatus("Initiating transaction...");

        const { confirmAttendance } = this.userGroup.methods;

        await confirmAttendance(meetingId, attendee).send({from: this.account});

        this.setStatus("Transaction complete!");
        this.refreshBalance();
    },

    setStatus: function(message) {
        $("#status").html(message);
    },
};

window.App = App;

window.addEventListener("load", function() {

    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }

    App.start();

});