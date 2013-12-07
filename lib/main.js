// The main module of the conjuror Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// In this case, creating a Widget that opens a new tab needs both the
// `widget` and the `tabs` modules.
var Widget = require("sdk/widget").Widget;
var tabs = require('sdk/tabs');
var data = require('sdk/self').data;

var pageWorker = require('sdk/page-worker');
var pageMod = require('sdk/page-mod');

var work;

function setupPriority(id, pr) {
    var script = "document.getElementById('id_priority').options.selectedIndex="+pr+";document.getElementsByName('save')[0].click();"
    pageWorker.Page({
        contentURL: "https://moztrap.mozilla.org/manage/caseversion/"+id.split("-")[2]+"/",
        contentScriptWhen: "end",
        contentScript: script
    });
}


pageMod.PageMod({
    include: "https://moztrap.mozilla.org/manage/cases/*",
    contentScriptWhen: "end",
    contentScriptFile: data.url("dataParser.js"),
    onAttach: function onAttach(worker) {
        console.log("DataParser.attached");

        work = worker;

        worker.port.on("setup", function(data) {
            console.log("SETUP: " + data.id);
            console.log("SETUP: " + data.pr);
            if (isNaN(data.pr)) {
                setupPriority(data.id, 0);
            }
            else {
                setupPriority(data.id, data.pr);
            }
        });
    }
});

exports.main = function() {

    // Widget documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/widget.html

    new Widget({
        // Mandatory string used to identify your widget in order to
        // save its location when the user moves it in the browser.
        // This string has to be unique and must not be changed over time.
        id: "MozTrap Prioritizer Tool",

        // A required string description of the widget used for
        // accessibility, title bars, and error reporting.
        label: "MozTizer",

        // An optional string URL to content to load into the widget.
        // This can be local content or remote content, an image or
        // web content. Widgets must have either the content property
        // or the contentURL property set.
        //
        // If the content is an image, it is automatically scaled to
        // be 16x16 pixels.
        contentURL: "https://moztrap.mozilla.org/static/images/favicon.ico",

        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {
            console.log("Widge is clicked");
            
            work.port.emit("item-click", 0);
        }
    });
};
