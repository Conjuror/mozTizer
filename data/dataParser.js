console.log("dataParser Kick off");

// parsing the page data from here

var articles = document.getElementsByTagName('article');
var priority = document.getElementsByClassName('priority');
var items = document.getElementsByClassName('item-summary');

var current = -9999;

function nextItem(i) {
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

function changePriority(i, pr) {
    priority[i].innerHTML = "*"+pr;
 }

document.addEventListener("keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 39 || e.keyCode == 40) {
        console.log("Show Next");

        items[current].click();
        nextItem(current+1);
    }
    else if (e.keyCode == 37 || e.keyCode == 38) {
        console.log("Show Previous");

        items[current].click();
        nextItem(current-1);
    }
    else if (e.keyCode == 49) {
        console.log("Priority 1");
        changePriority(current, "1");
    }
    else if (e.keyCode == 50) {
        console.log("Priority 2");
        changePriority(current, "2");
    }
    else if (e.keyCode == 51) {
        console.log("Priority 3");
        changePriority(current, "3");
    }
    else if (e.keyCode == 52) {
        console.log("Priority 4");
        changePriority(current, "4");
    }
    else if (e.keyCode == 78 || e.keyCode == 83) {
        console.log("None");
        changePriority(current, "None");
    }
}, false);

self.port.on("item-click", function(i) {
    nextItem(i);
});