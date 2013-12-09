console.log("dataParser Kick off");

// parsing the page data from here

var articles = document.getElementsByTagName('article');
var priority = document.getElementsByClassName('priority');
var items = document.getElementsByClassName('item-summary');

var current = -9999;

function checkOpenItem(i) {
    var opened = document.getElementsByClassName('itembody open');

    if (opened.length == i) {
        return true;
    }
    while (opened.length > 0) {
        opened[0].getElementsByTagName('a')[0].click();
    }
    current = -9999;
    return false;
}

function nextItem(i) {
    if (current<0 || !checkOpenItem(0)) {
        i = 0;
    }

    console.log("Click on " + i);
    console.log("article caseversion" + articles[i].id);

    if (current >= 0 && priority[current].innerHTML.charAt(0) == "*") {
        pr = priority[current].innerHTML.substr(1);

        var setting = {};
        setting.id = articles[current].id;
        setting.pr = pr;
        self.port.emit("setup", setting);

        priority[current].innerHTML = pr;
    }

    current = i;
    items[current].click();
}

function countPriority() {
    var a = [0, 0, 0, 0, 0];
    for (var i = 0 ; i < priority.length ; i++) {
        if (isNaN(priority[i].innerHTML)) {
            a[0] += 1;
        }
        else {
            a[parseInt(priority[i].innerHTML)] += 1;
        }
    }
    var result = "None: "+a[0]+", P1: "+a[1]+", P2: "+a[2]+", P3: "+a[3]+", P4: "+a[4]+", in "+priority.length;
    self.port.emit("setContent", result);
    console.log("MozTizer: " + result);
}

function changePriority(i, pr) {
    if (checkOpenItem(1)) {
        countPriority();
        priority[i].innerHTML = "*" + pr;
    }
}

self.port.on("item-click", function(i) {
    nextItem(i);
});

document.addEventListener("keyup", function(e) {
    if (e.keyCode == 13 || e.keyCode == 39 || e.keyCode == 40) {
        console.log("Show Next");

        items[current].click();
        nextItem(current + 1);
    } else if (e.keyCode == 37 || e.keyCode == 38) {
        console.log("Show Previous");

        items[current].click();
        nextItem(current - 1);
    } else if (e.keyCode == 49) {
        console.log("Priority 1");
        changePriority(current, "1");
    } else if (e.keyCode == 50) {
        console.log("Priority 2");
        changePriority(current, "2");
    } else if (e.keyCode == 51) {
        console.log("Priority 3");
        changePriority(current, "3");
    } else if (e.keyCode == 52) {
        console.log("Priority 4");
        changePriority(current, "4");
    } else if (e.keyCode == 78 || e.keyCode == 83) {
        console.log("None");
        changePriority(current, "None");
    }
}, false);

// document.getElementsByClassName('itembody details').addEventListener("click", function(e) {

// });

nextItem(0);
countPriority();