var navbarButtons = document.querySelector(".navbar").children;
var currentPageIndex = getCurrentPageIndex();

var pages = [
    document.getElementById("projects-container"),
    document.getElementById("blogs-container"),
    document.getElementById("contact-container")
];

reconstructNavBar();

function getCurrentPageIndex() {
    var currentIndex = -1;
    for(var i = 0;i<navbarButtons.length;i++) {
        if(navbarButtons[i].classList.contains("selected")) {
            currentIndex = i;
            break;
        }
    }
    if(currentIndex < 0) {
        navbarButtons[0].classList.add("selected");
        return 0;
    }
    return currentIndex;
}
function reconstructNavBar() {
    for(var i = 0;i<navbarButtons.length;i++) {
        var navbarButton = navbarButtons[i];
        var linkElement = navbarButton.firstChild;

        var scriptedLinkElement = (function(index,linkText){

            var buttonElement = document.createElement("button");
            var buttonText = document.createTextNode(linkText);

            buttonElement.appendChild(buttonText);
            buttonElement.onclick = function(event) {
                changePage(index);
                event.preventDefault();
            }

            return buttonElement;
        })(i,linkElement.innerText);

        navbarButton.removeChild(linkElement);
        navbarButton.appendChild(scriptedLinkElement);
    }
}
function clearCurrentPage() {
    navbarButtons[currentPageIndex].classList.remove("selected");
    pages[currentPageIndex].classList.add("hidden");
}
function applyNewPage() {
    navbarButtons[currentPageIndex].classList.add("selected");
    pages[currentPageIndex].classList.remove("hidden");
}
var preventHashUpdate = false;
function getCurrentPageHash() {
    switch(currentPageIndex) {
        default:
        case 0:
            return "#projects";
        case 1:
            return "#blogs";
        case 2:
            return "#about";
    }
}

function changePage(newPageIndex) {
    if(newPageIndex === currentPageIndex) {
        return;
    }
    clearCurrentPage();
    currentPageIndex = newPageIndex;
    applyNewPage();
    console.log("Changed to page " + newPageIndex);
    window.location.hash = getCurrentPageHash();
}
function processHashChange() {
    if(window.location.hash !== getCurrentPageHash()) {
        reloadByHash(false);
    }
}
function reloadByHash() {
    if(window.location.hash) {
        switch(document.location.hash) {
            default:
                window.location.hash = getCurrentPageHash();
                break;
            case "#projects":
                changePage(0);
                break;
            case "#blogs":
                changePage(1);
                break;
            case "#about":
                changePage(2);
                break;
        }
    } else {
        window.location.hash = getCurrentPageHash();
    }
}
window.onhashchange = processHashChange;
reloadByHash();
