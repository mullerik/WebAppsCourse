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

var allItems = {
    1: "CHECK YOUR PASSPORT AND APPLY FOR ANY NECESSARY VISAS",
    2: "GET VACCINATED AND STOCK UP ON MEDICINE",
    3: "CHECK FOR TRAVEL WARNINGS/ADVISORIES AND REGISTER YOUR TRIP.",
    4: "PREPARE YOUR FINANCES",
    5: "MAKE COPIES OF TRAVEL DOCUMENTS",
    6: "OBTAIN AN INTERNATIONAL DRIVING PERMIT",
    7: "GET ALL THE NECESSARY GEAR FOR YOUR ELECTRONICS",
    8: "LEARN KEY PHRASES IN THE LOCAL LANGUAGE",
    9: "RESEARCH ENTRANCE AND EXIT FEES",
    10: "BUY HEALTH AND TRAVEL INSURANCE"
};
function displayErrorMessage(status){
    // Clear error messages
    document.getElementById("warningMessage403").style.display = "none";
    document.getElementById("warningMessage500").style.display = "none";
    if (status == 403) {
        document.getElementById("warningMessage403").style.display = "block";
    } else if (status == 500) {
        document.getElementById("warningMessage500").style.display = "block";
    }
}

function resetTable(tableID){
    var table = document.getElementById(tableID);
    table.innerHTML = "";
    var row = table.insertRow();
    var headerCell1 = row.insertCell(0);
    headerCell1.outerHTML = "<th>ID</th>";
    var headerCell2 = row.insertCell(1);
    headerCell2.outerHTML = "<th>Description</th>";
}

function togglePages() {
    if (document.getElementById("loginPage").style.display === "none") {
        document.getElementById("loginPage").style.display = "inline";
        document.getElementById("contentPage").style.display = "none";
        document.getElementsByTagName("body")[0].style.background = 'darkslategrey';
    } else {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("contentPage").style.display = "inline";
        document.getElementsByTagName("body")[0].style.background = 'url("/public/images/pexels-photo-199898.jpeg")';
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
        if (this.readyState == 4) {
            if (this.status == 200) {
                togglePages();
                console.log("Logged in with user: " + user.value);
                var oldText = document.getElementById("connectedWelcome").innerText;
                var newText = oldText.replace("user", user.value);
                document.getElementById("connectedWelcome").innerText = newText;
                refreshItemList();
            } else if (this.status == 403 || this.status == 500) {
                displayErrorMessage(this.status)
            }
        }
    };
    xhttp.open("POST", "/login/" + user.value + "/" + password.value, true);
    xhttp.send();
}

function logoutAjax() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // No need to toggle pages anymore, since we're using reload later on
            // togglePages();
            console.log("Logged out");
        }
    };
    xhttp.open("POST", "/logout", true);
    xhttp.send();
    location.reload();
}

function refreshItemList(){
    var table = document.getElementById("doneTasksTable");
    resetTable("doneTasksTable");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var respObj = JSON.parse(this.responseText);
            for (var i in respObj) {
                var curItemID = respObj[i].id;
                var curItem = respObj[i].data;
                var row = table.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerText = curItemID;
                cell2.innerText = curItem;
            }
            allAvailableItems(respObj)
        }
    };
    xhttp.open("GET", "/items", true);
    xhttp.send();
}

function arrayToObject(arr){
    var tempObj = {};
    for(var i in arr){
        tempObj[arr[i]["id"]] = arr[i]["data"];
    }
    return tempObj;
}

function allAvailableItems(userTasks){
    userTasks = arrayToObject(userTasks);
    var table = document.getElementById("allTasksTable");
    resetTable("allTasksTable");
    Object.keys(allItems).forEach(function(key, index){
        // Don't show tasks user already finished
        if (key in userTasks)
            return;

        // Otherwise - add them to list
        var curItem = allItems[key];
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerText = key;
        cell2.innerText = curItem;
    });
}

function addItem() {
    var itemID = document.getElementById("itemInput");
    if (!(itemID.value in allItems)) {
        console.log("Error: item id is not in all items");
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            refreshItemList();
        }
    };
    xhttp.open("POST", "/item/", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("id=" + itemID.value + "&data=" + allItems[itemID.value]);
}

function removeItem() {
    var itemID = document.getElementById("itemInput");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            refreshItemList();
        }
    };
    xhttp.open("DELETE", "/item/" + itemID.value, true);
    xhttp.send();
}