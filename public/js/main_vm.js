// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";


const socket = io();

// the packet is whatever data we sent through with the connect event
// from the server

// this is data destructing. Go look it up on MDN
function setUserId({ sID }) {
  // debugger;
  console.log(sID);
  vm.socketID = sID;
  //   vm.notification.push(sID + " joined the chatroom");
}

function showDisconnectMessage() {
  console.log("a user disconnected");
}

function appendMessage(message) {
  vm.messages.push(message);
}

function appendUser(name) {
  vm.notification.unshift(name + " joined");
  //   vm.nicknameList.push(name);
}

function deleteUser(name) {
  vm.notification.unshift(name + " disconnected");
  //   let index = vm.nicknameList.indexOf(name);
  //   vm.nicknameList.splice(index, 1);
}

function getUser(user) {
  vm.nicknameList = user;
}

const vm = new Vue({
  data: {
    socketID: "",
    message: "",
    nicknameList: [],
    messages: [],
    notification: [],
    loginDialog: true,
    username: "admin",
    password: "123456",
    nickname: ""
  },
  // data: {
  //     message:[
  //         {
  //             name: "TVR",
  //             content:"hello"
  //         },

  //         {
  //             name: "dd",
  //             content:"ignore"
  //         }

  //     ]
  // },

  methods: {
    // emit a message event to the server so that it can in
    // turn send this to anyone who's connected
    dispatchMessage() {
      console.log("handle emit message");

      // the double pipe || is an "or" operator
      // if the first value is set, use it. else use
      // whatever comes after the "or" operator
      socket.emit("chat_message", {
        content: this.message,
        name: this.nickname || "anonymous"
      });

      this.message = "";
    },
    dispatchNikename() {
      socket.emit("new_user", this.nickname || "anonymous");
      this.loginDialog = !this.loginDialog;
    }
  },

  mouted: function() {
    console.log("vue is done mounting");
  },

  components: {
    newmessage: ChatMessage,
    notification: Notification
  }
}).$mount("#app");

socket.addEventListener("connected", setUserId);
socket.addEventListener("disconnect", showDisconnectMessage);
socket.addEventListener("new_message", appendMessage);
socket.addEventListener("user-connected", appendUser);
socket.addEventListener("user-disconnected", deleteUser);
socket.addEventListener("get-users", getUser);
