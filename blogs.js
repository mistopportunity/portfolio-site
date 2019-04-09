"use strict";
const websitetitle = document.title;
const pagesroot = "posts/";
const indexlocation = `${pagesroot}/Index`;
const pages = document.getElementById("pages");
let light = true;
function defaultLightSet() {
    const lightdata = localStorage.getItem("light");
    if(lightdata === "off") {
        light = false;
        document.body.className = "dark";
    } else {
        light = true;
        document.body.className = "light";
    }
}
defaultLightSet();
function togglelight() {
    light = !light;
    if(light) {
        document.body.className = "light";
        localStorage.setItem("light","on");
    } else {
        document.body.className = "dark";
        localStorage.setItem("light","off");
    }
}
let nav2shown = false;
function togglenavigation2() {
    const navbar = document.getElementById("navbar2");
    nav2shown = !nav2shown;
    if(nav2shown) {
        navbar.style.display = "initial";
    } else {
        navbar.style.display = "none";
    }
    pages.classList.toggle("doubletop");
}
let bookmarking = false;
function bookmarklocation() {
    if(navigating || bookmarking || historyIndex < 1) {
        return;
    }
    bookmarking = true;
    const bookmark = document.getElementById("bookmarkbutton");
    bookmark.classList.toggle("disabled");
    if(bookmarkexists(pagehistory[historyIndex])) {
        removebookmark(pagehistory[historyIndex]);
        bookmark.textContent = "removed!";
    } else {
        addbookmark(pagehistory[historyIndex]);
        bookmark.textContent = "added!";
    }
    setTimeout(function() {
        setbookmarktext();
        bookmark.classList.toggle("disabled");
        bookmarking = false;
    },200);
}
function removebookmark(name) {
    let data = localStorage.getItem("bookmarks");
    if(data === null) {
        return;
    }
    data = JSON.parse(data);
    data.splice(data.indexOf(name),1);
    localStorage.setItem("bookmarks",JSON.stringify(data));
}
function addbookmark(name) {
    let data = localStorage.getItem("bookmarks");
    if(data === null) {
        data = [];
    } else {
        data = JSON.parse(data);
    }
    data.push(name);
    localStorage.setItem("bookmarks",JSON.stringify(data));
}
function bookmarkexists(name) {
    const data = localStorage.getItem("bookmarks");
    if(data === null) {
        return false;
    }
    return JSON.parse(data).includes(name);

}
function getbookmarks() {
    const data = localStorage.getItem("bookmarks");
    if(data === null) {
        return null;
    } else {
        return JSON.parse(data);
    }

}
let backButtonEnabled = false;
let forwardButtonEnabled = false;
function enableBackButton() {
    document.getElementById("backbutton").classList.remove("disabled");
    backButtonEnabled = true;
}
function disableBackButton() {
    document.getElementById("backbutton").classList.add("disabled");
    backButtonEnabled = false;
}
function enableForwardButton() {
    document.getElementById("forwardbutton").classList.remove("disabled");
    forwardButtonEnabled = true;
}
function disableForwardButton() {
    document.getElementById("forwardbutton").classList.add("disabled");
    forwardButtonEnabled = false;
}
function setbookmarktext() {
    if(bookmarkexists(pagehistory[historyIndex])) {
        bookmarkbutton.textContent = "unsave";
    } else {
        bookmarkbutton.textContent = "save";
    }
}
function enablepostindexbuttons() {
    const bookmarkbutton = document.getElementById("bookmarkbutton");
    const indexbutton = document.getElementById("indexreturn");
    bookmarkbutton.classList.remove("disabled");
    indexbutton.classList.remove("disabled");
    setbookmarktext();
    indexbutton.textContent = "return to index";
}
function disablepostindexbuttons() {
    const bookmarkbutton = document.getElementById("bookmarkbutton");
    const indexbutton = document.getElementById("indexreturn");
    bookmarkbutton.classList.add("disabled");
    indexbutton.classList.add("disabled");
    bookmarkbutton.textContent = "";
    indexbutton.textContent = "";
}
function settitle(title) {
    const titlesplit = title.split("/");
    const filename = titlesplit[titlesplit.length-1];
    if(title !== websitetitle) {
        document.title = `${websitetitle}: ${title}`
    } else {
        document.title = websitetitle;
    }
    document.getElementById("title").textContent = filename;
}
let historyIndex = 0;
let pagehistory = [indexlocation];
function getpage(pagefile,callback) {
    const client = new XMLHttpRequest();
    client.open("GET", pagefile);
    client.onload = function() {
        if(client.status === 200 || client.status === 0) {
            callback(client.responseText);
        } else {
            callback(`${pagefile} is missing.`);
        }

    }
    client.onerror = function() {
        callback(`${pagefile} is missing.`);
    }
    client.send();
}
let navigating = true;
function navigate(newlocation) {
    if(navigating) {
        return;
    }
    navigating = true;
    disableBackButton();
    disableForwardButton();
    if(newlocation.indexOf("/") < 0 || newlocation === indexlocation) {
        loadIndex();
        return;
    }
    getpage(newlocation,function(page) {
        const historyStartLength = pagehistory.length-1;
        for(var i = historyIndex;i<historyStartLength;i++) {
            pagehistory.pop();
        }
        historyIndex = pagehistory.length;
        settitle(newlocation);
        pagehistory.push(newlocation);
        clearpages();
        addpages(page.split("[end-page]"));
        if(nav2shown) {
            togglenavigation2()
        }
        logicalbuttonset();
        window.scrollTo(0,0);
        navigating = false;
    });
}
function logicalbuttonset() {
    if(historyIndex === 0) {
        disableBackButton();
        if(pagehistory.length > 1) {
            enableForwardButton();
        } else {
            disableForwardButton();
        }
        disablepostindexbuttons();
        return;
    } else if(historyIndex === pagehistory.length-1) {
        enableBackButton();
        disableForwardButton();
    }
    enablepostindexbuttons();
}
function buttonnavigate(callback) {
    disableBackButton();
    disableForwardButton();
    getpage(pagehistory[historyIndex],function(page) {
        settitle(pagehistory[historyIndex]);
        clearpages();
        addpages(page.split("[end-page]"));
        logicalbuttonset();
        if(callback) {
            callback();
        }
        window.scrollTo(0,0);
        navigating = false;
    });
}
function goback() {
    if(navigating || !backButtonEnabled) {
        return;
    }
    navigating = true;
    historyIndex--;
    if(historyIndex === 0) {
        loadIndex(function() {
            if(nav2shown) {
                togglenavigation2()
            }
        });
    } else {
        buttonnavigate(function() {
            if(nav2shown) {
                togglenavigation2()
            }
        });
    }
}
function goforward() {
    if(navigating || !forwardButtonEnabled) {
        return;
    }
    navigating = true;
    historyIndex++;
    buttonnavigate(function () {
        if(nav2shown) {
            togglenavigation2();
        }
    });
}
function returntoindex() {
    if(navigating) {
        return;
    }
    navigating = true;
    historyIndex = 0;
    loadIndex(togglenavigation2);
    
}
function loadIndex(callback) {
    logicalbuttonset();
    const client = new XMLHttpRequest();
    client.open("GET",indexlocation);
    const bookmarks = getbookmarks();
    let bookmarkpage = null;
    if(bookmarks !== null && bookmarks.length !== 0) {
        bookmarkpage = '<span class="bold underline">Your Bookmarks</span><br>';
        for(let i = 0;i<bookmarks.length;i++) {
            bookmarkpage += `<span class="link" onclick="navigate('${bookmarks[i]}')">${i+1}. ${bookmarks[i]}</span><br>`;
            if(i < bookmarks.length-1) {
                bookmarkpage += "<br>";
            }
        }
    }
    client.onload = function() {
        clearpages();
        if(bookmarkpage !== null) {
            addpages([bookmarkpage]);
        }
        if(client.status === 200 || client.status === 0) {
            addpages(client.responseText.split("[end-page]"));
            settitle(websitetitle);
        } else {
            addpages(["Error loading index file. Sorry :("])
            settitle(websitetitle);
        }
        if(callback) {
            callback();
        }
        window.scrollTo(0,0);
        navigating = false;
    }
    client.onerror = function() {
        clearpages();
        if(bookmarkpage !== null) {
            addpages([bookmarkpage]);
        }
        addpages(["Error loading index file. Sorry :("])
        settitle(websitetitle);
        if(callback) {
            callback();
        }
        window.scrollTo(0,0);
        navigating = false;
    }
    client.send();
}
function clearpages() {
    while(pages.firstChild) {
        pages.removeChild(pages.firstChild);
    }
}
function addpages(textwithhtml) {
    for(let i  = 0; i <textwithhtml.length;i++) {
        const div = document.createElement("div");
        const p = document.createElement("p");
        p.innerHTML = textwithhtml[i];
        div.appendChild(p);
        pages.appendChild(div);
    }
}
loadIndex();
