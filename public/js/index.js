
window.onload = function () {

    var pageContainer = document.getElementsByClassName("page-container")[0];
    var popupContainer = document.getElementsByClassName("pop-up-container")[0];
    localStorage.clear();

    fetchHtmlPage = function (pageName) {
        var pagePath = pageName + '.html';
        return fetch(pagePath)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                } else {
                    var parser = new DOMParser();
                    var element = parser.parseFromString(response.text(), 'text/html');
                    return element;
                }
            })
            .catch(function (err) {
                console.warn('Something went wrong.', err);
            });
    }
    initPopupEvents = function () {
        var popupDiv = document.getElementById("pop-up");
        var popupCloseBtn = document.getElementsByClassName("pop-up-close")[0];
        var popupOkBtn = document.getElementsByClassName("pop-up-ok")[0];
        var shortContentDiv = document.querySelector(".short-content");

        popupCloseBtn.onclick = function () {
            popupDiv.style.display = "none";
        }

        popupOkBtn.onclick = function () {
            popupDiv.style.display = "none";
            if (localStorage.getItem("short-pop-up") === null) {
                fetchHtmlPage("short-pop-up")
                    .then(function (element) {
                        popupContainer.appendChild(element);
                        setLocalStorageItem("long-pop-up", element);
                    });
            } else {
                setShortPopupDIv(shortContentDiv);
            }
        }

        //on clicking outside area of pop up, it should dismiss
        window.onclick = function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (event.target == popupDiv) {
                popupDiv.style.display = "none";
            }
        }
    }

    initPageEvents = function () {
        var togglePopupButton = document.getElementsByClassName("show-pop-up-btn")[0];
        togglePopupButton.onclick = function () {
            var shortPopupElement = localStorage.getItem("short-pop-up");
            if (shortPopupElement === null) {
                fetchHtmlPage("short-pop-up")
                    .then(function (element) {
                        popupContainer.appendChild(element);
                        setLocalStorageItem("short-pop-up", element);
                        setPageDIv();
                    });
            } else {
                setPageDIv();
                var html = parser.parseFromString(shortPopupElement, 'text/html');

                setShortPopupDIv(html);
            }
        }
    }

    setLocalStorageItem = function (pageName, html) {
        localStorage.setItem(pageName, html);
    }

    setPageDIv = function (shortContentDiv) {
        var popupDiv = document.getElementById("pop-up");
        popupDiv.style.display = "block";
        initPopupEvents();
    }

    setShortPopupDIv = function (shortContentDiv) {
        shortContentDiv.style.display = "none";
        initPopupEvents();
    }

    function htmlToElements(html) {
        var template = document.createElement('template');
        template.innerHTML = html;
        console.log('template.content.childNodes',template.content.childNodes)
        return template.content.childNodes;
    }
    
    fetchHtmlPage("page-content")
        .then(function (element) {
            htmlToElements(element);
            // pageContainer.appendChild(element);
            setLocalStorageItem("page-content", element);
            // initPageEvents();
        });
}
