// The main module of the conjuror Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// In this case, creating a Widget that opens a new tab needs both the
// `widget` and the `tabs` modules.
var Widget = require("sdk/widget").Widget;
var tabs = require('sdk/tabs');
var data = require('sdk/self').data;

var pageWorker = require('sdk/page-worker');
var pageMod = require('sdk/page-mod');

var pageListener, widget;

var MT = {};
MT.enabled = false;
MT.work = null;

// create a pageWorker to add an invisible tab and set priority when it's called
MT.setupPriority = function(id, pr) {
    if (MT.enabled) {
        console.log("MozTizer: Set CaseVersion ID <" + id + "> to Priority +<" + pr + ">");

        var script = "document.getElementById('id_priority').options.selectedIndex="+pr+";document.getElementsByName('save')[0].click();";
        pageWorker.Page({
            contentURL: "https://moztrap.mozilla.org/manage/caseversion/"+id.split("-")[2]+"/",
            contentScriptWhen: "end",
            contentScript: script
        });
    }
};

pageListener = pageMod.PageMod({
    include: "https://moztrap.mozilla.org/manage/cases/*",
    contentScriptWhen: "end",
    contentScriptFile: data.url("dataParser.js"),
    onAttach: function onAttach(worker) {
        console.log("DataParser.attached");

        MT.work = worker;

        worker.port.on("setContent", MT.updateStatus);

        worker.port.on("setup", function(data) {
            if (isNaN(data.pr)) {
                MT.setupPriority(data.id, 0);
            } else {
                MT.setupPriority(data.id, data.pr);
            }
        });
    }
});

MT.updateStatus = function(text) {
    widget.content = text;
    widget.width = 300;
};

// While a test case page is load, the plugin will load a listener
MT.togglePageMod = function() {

    if (!MT.enabled) {
        MT.enabled = true;
        MT.work.port.emit("toggle", MT.enabled);
    }
    else {
        MT.enabled = false;
        MT.work.port.emit("toggle", MT.enabled);
    }
};

exports.main = function() {

    widget = new Widget({

        id: "MozTrap Prioritizer Tool",
        label: "MozTizer",
        content: "MozTizer",
        width: 60,
        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {
            console.log("Widget is clicked");

            MT.togglePageMod();
            MT.work.port.emit("item-click", 0);
        }
    });
};
