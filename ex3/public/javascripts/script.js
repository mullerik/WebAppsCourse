var login = document.getElementById("loginBtn");
login.addEventListener('click', loginAjax);
var register = document.getElementById("registerBtn");
register.addEventListener('click', registerAjax);
var logout = document.getElementById("logoutBtn");
logout.addEventListener('click', logoutAjax);

var postItem = document.getElementById("postBtn");
postItem.addEventListener('click', addItem);
var deleteItem = document.getElementById("removeBtn");
deleteItem.addEventListener('click', removeItem);

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function togglePages() {
    if (document.getElementById("loginPage").style.display === "none") {
        document.getElementById("loginPage").style.display = "inline";
        document.getElementById("contentPage").style.display = "none";
    } else {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("contentPage").style.display = "inline";
    }
}

function registerAjax() {
    var user = document.getElementById("username");
    var password = document.getElementById("password");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Registered user: " + user.value);
        }
    };
    xhttp.open("POST", "/register/" + user.value + "/" + password.value, true);
    xhttp.send();
}

function loginAjax() {
    var user = document.getElementById("username");
    var password = document.getElementById("password");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            togglePages();
            console.log("Logged in with user: " + user.value);
            document.getElementById("userName").innerHTML = '<p>' + user.value + '</p>';
            refreshItemList();
        }
    };
    xhttp.open("POST", "/login/" + user.value + "/" + password.value, true);
    xhttp.send();
}

function logoutAjax() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            togglePages();
            console.log("Logged out");
        }
    };
    xhttp.open("POST", "/logout", true);8
    xhttp.send();
}

function refreshItemList(){
    var items = document.getElementById("items");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var respObj = JSON.parse(this.responseText);
            items.innerHTML = "";
            for (var i in respObj) {
                var currentPost = respObj[i].data;
                items.innerHTML += (currentPost + "<br/>");
            }
        }
    };
    xhttp.open("GET", "/items", true);
    xhttp.send();
}

function addItem() {
    var newItem = document.getElementById("newItem");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            refreshItemList();
        }
    };
    xhttp.open("POST", "/item/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send("id=1&data=tent");
}

function removeItem() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            refreshItemList();
        }
    };
    xhttp.open("DELETE", "/item/" + 1, true);
    xhttp.send();
}