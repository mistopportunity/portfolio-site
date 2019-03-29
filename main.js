var navbarButtons = document.querySelector(".navbar").children;
var currentPageIndex = getCurrentPageIndex();
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
}
function applyNewPage() {
    navbarButtons[currentPageIndex].classList.add("selected");
}
function changePage(newPageIndex) {
    clearCurrentPage();
    currentPageIndex = newPageIndex;
    applyNewPage();
    console.log("Changed to page " + newPageIndex);
}
