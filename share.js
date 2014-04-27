(function () { "use strict";

var key = "SEEN_INVITE:"+location.href;
var lastSeen = localStorage.getItem(key) || 0;
if (Date.now() - lastSeen < 12*60*60*1000) {
    return;
}
localStorage.setItem(key, Date.now());

var overlay = document.getElementById("share-overlay");
overlay.style.position = "absolute";
overlay.style.width = "100%";
overlay.style.height = "100%";
// overlay.style.width = "80%";
// overlay.style.height = "80%";
// overlay.style.top = "10%";
// overlay.style.left = "10%";
overlay.style.background = "rgba(0,0,0,0.5)";
overlay.style.zIndex = "9999";
overlay.style.display = "";

var hide = function (send) {
    if (send) {
        kik.send({
            title: "Free App Today! Install Now!",
            text: "Download a free app now!",
            pic: "free256.png",
            data: {id: "invite_step"},
        });
    }
    overlay.style.display = "none";
};

var okButton = document.getElementById("share-ok");
if (okButton != null) {
    okButton.onclick = function () {
        hide(true);
        ga("send", "event", "Invite step", "Accepted");
    };
}

var cancelButton = document.getElementById("share-cancel");
if (cancelButton != null) {
    cancelButton.onclick = function () {
        hide(false);
        ga("send", "event", "Invite step", "Declined");
    };
}
ga("send", "event", "Invite step", "Seen");

})();
