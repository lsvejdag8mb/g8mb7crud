async function registration() {
  let fn = document.getElementById("reg_fullname").value;
  let un = document.getElementById("reg_username").value;
  let pw = document.getElementById("reg_password").value;
  let em = document.getElementById("reg_email").value;

  let url = "https://nodejs-3260.rostiapp.cz/users/registry";
  let body = {};
  body.fullname = fn;
  body.username = un;
  body.password = pw;
  body.email = em;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    showLogin();
  } else {
    alert(data.error);
  }
}

let userToken;
let timer; 

async function login() {
  let un = document.getElementById("username").value;
  let pw = document.getElementById("password").value;

  let url = "https://nodejs-3260.rostiapp.cz/users/login";
  let body = {};
  body.username = un;
  body.password = pw;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    userToken = data.token;
    showChat();
  } else {
    alert(data.error);
  }
}

async function logout() {
  if (!confirm("Logout? ...are you sure?!?")) return;

  let url = "https://nodejs-3260.rostiapp.cz/users/logout";
  let body = {};
  body.token = userToken;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  if (data.status == "OK") {
    clearInterval(timer);
    userToken = undefined;
    showLogin();
  } else {
    alert(data.error);
  }
}

async function sendMessagePOST() {
  let m = document.getElementById("message").value;
  document.getElementById("message").value = ""; //clear message text on page
  document.getElementById("message").focus(); //text cursor to input

  let url = "https://nodejs-3260.rostiapp.cz/chat/addMsg";
  let body = {};
  body.msg = m;
  body.chat = "ide933a740f211a5579b56dede4bb2c5";
  body.token = userToken;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();

}

async function updateMessages() {
  let url = "https://nodejs-3260.rostiapp.cz/crud/read";
  let body = {};
  body.appId = "f37620849972633644bbc5e1817f8227";
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  let s = "<table class='table'>";
  s = s + "<tr><th>Jméno</th><th>Příjmení</th><th>Rok narození</td><th>E-mail</td><th>Potvrzeno</td></tr>";
  for (let m of data.items) {
    s = s + "<tr><td>" + m.obj.jmeno + "</td><td>" + m.obj.prijmeni + "</td><td>" + m.obj.roknar + "</td><td>" + m.obj.email + "</td><td>" + m.obj.potvrzeno + "</td></tr>";
  }
  s = s + "</table>";

  document.getElementById("messageList").innerHTML = s;
}

function onKeyDown(event) {
  console.log(event.key);
  if (event.key == "Enter") {
    sendMessage();
  }
}

function showLogin() {
  document.getElementById("registration").style.display = "none";
  document.getElementById("login").style.display = "block";
  document.getElementById("chat").style.display = "none";
}

function showRegistration() {
  document.getElementById("registration").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "none";
}

function showChat() {
  document.getElementById("registration").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";

  updateMessages();
}

function onLoad() {
  showChat();

  document.getElementById("message").addEventListener("keydown", onKeyDown);
}