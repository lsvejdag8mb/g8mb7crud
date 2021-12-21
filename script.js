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
    showItems();
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

async function createItem() {
  let url = "https://nodejs-3260.rostiapp.cz/crud/create";
  let body = {};
  body.appId = "f37620849972633644bbc5e1817f8227";
  if (idEdit) {
    url = "https://nodejs-3260.rostiapp.cz/crud/update";
    body.id = idEdit; //which item to modify
  }
  body.obj = {}; //we must set properties into body.obj!!!
  body.obj.jmeno = document.getElementById("jmeno").value;
  body.obj.prijmeni = document.getElementById("prijmeni").value;
  body.obj.roknar = document.getElementById("roknarozeni").value;
  body.obj.email = document.getElementById("email").value;
  body.obj.potvrzeno = document.getElementById("potvrzeno").checked;
  body.obj.obrazek = picUrl;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();

  updateItems();

}

let idEdit = undefined;

async function editItem(id) {
  idEdit = id;

  let url = "https://nodejs-3260.rostiapp.cz/crud/read";
  let body = {};
  body.appId = "f37620849972633644bbc5e1817f8227";
  body.id = id;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  //set item values to form
  let o = data.items[0].obj;
  document.getElementById("jmeno").value = o.jmeno;
  document.getElementById("prijmeni").value = o.prijmeni;
  document.getElementById("roknarozeni").value = o.roknar;
  document.getElementById("email").value = o.email;
  document.getElementById("potvrzeno").checked = o.potvrzeno;
  if (o.obrazek) {
    document.getElementById("picture").src = o.obrazek;
  } else {
    document.getElementById("picture").src = "avatar.png";
  }

}

async function deleteItem(id) {
  if (!confirm("Delete? ...are you sure?")) {
    return;
  }  

  let url = "https://nodejs-3260.rostiapp.cz/crud/delete";
  let body = {};
  body.appId = "f37620849972633644bbc5e1817f8227";
  body.id = id;
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  updateItems();
}

async function updateItems() {
  idEdit = undefined; //clear item id for update

  let url = "https://nodejs-3260.rostiapp.cz/crud/read";
  let body = {};
  body.appId = "f37620849972633644bbc5e1817f8227";
  let response = await fetch(url, {"method":"POST", "body": JSON.stringify(body)});
  let data = await response.json();
  console.log(data);

  let s = "<table class='table'>";
  s = s + "<tr><th> </th><th>Jméno</th><th>Příjmení</th><th>Rok narození</th><th>E-mail</th><th>Potvrzeno</th><th></th></tr>";
  for (let m of data.items) {
    s = s + "<tr><td>";
    if (m.obj.obrazek) {
      s = s + "<img src='" + m.obj.obrazek + "' height='32'>";
    }
    s = s + "</td><td>" + m.obj.jmeno + "</td><td>" + m.obj.prijmeni + "</td><td>" + m.obj.roknar + "</td><td>" + m.obj.email + "</td><td>" + m.obj.potvrzeno + "</td>";
    s = s + "<td>";
    s = s + "<button onclick='editItem(" + m.id +")'>upravit</button>";
    s = s + "<button onclick='deleteItem(" + m.id +")'>odstranit</button>";
    s = s + "</td>";
    s = s + "</tr>";
  }
  s = s + "</table>";

  document.getElementById("itemList").innerHTML = s;
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
  document.getElementById("items").style.display = "none";
}

function showRegistration() {
  document.getElementById("registration").style.display = "block";
  document.getElementById("login").style.display = "none";
  document.getElementById("items").style.display = "none";
}

function showItems() {
  document.getElementById("registration").style.display = "none";
  document.getElementById("login").style.display = "none";
  document.getElementById("items").style.display = "block";

  updateItems();
}

function onLoad() {
  showItems();

  //document.getElementById("message").addEventListener("keydown", onKeyDown);
}


function getBase64Image(img, resize = false) {
  let cnv = document.createElement("canvas");
  if (resize) {
      cnv.width = img.width;
      cnv.height = img.height;
  } else {
      cnv.width = img.naturalWidth;
      cnv.height = img.naturalHeight;
  }

  let ctx = cnv.getContext("2d");
  ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

  return cnv.toDataURL();
}

let picUrl;
function savePicture() {
  const file = document.getElementById('file_pic').files[0];
  if (!file) return; //stisknuto Storno
  let tmppath = URL.createObjectURL(file); //create temporary file
  let img = document.getElementById("picture");
  img.src = tmppath;
  img.onload = function(){
      let url = 'https://nodejs-3260.rostiapp.cz/crud/upload';
      let body = {};
      body.appId = "f37620849972633644bbc5e1817f8227";
      body.fileName = file.name;
      body.contentType = file.type;
      body.data = getBase64Image(img, true); //convert to Base64
      fetch(url, {method: "POST", body: JSON.stringify(body)})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            picUrl = 'https://nodejs-3260.rostiapp.cz/' + data.savedToFile;
            img.onload = null;
        })
        .catch(err => {
            console.log(err);
        });
  };
}

