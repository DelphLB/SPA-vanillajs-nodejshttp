
window.onload = function () {

    var pageContainer = document.getElementsByClassName("page-container")[0];
    var popupContainer = document.getElementsByClassName("pop-up-container")[0];
    localStorage.clear();

    fetchHtmlPage = function (pageName) { // for fetching html content
        var pagePath = pageName + '.html';
        return fetch(pagePath)
            .then(function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                } else {
                    return response.text();
                }
            })
            .catch(function (err) {
                console.warn('Something went wrong.', err);
            });
    }

    initPopupEvents = function () { // initialize popup contents
        var popupDiv = document.getElementById("pop-up");
        var popupCloseBtn = document.getElementsByClassName("pop-up-close")[0];
        var popupOkBtn = document.getElementsByClassName("pop-up-ok")[0];
        popupCloseBtn.onclick = function () {
            var shortContent = document.querySelector('#short-content');
            var longContent = document.querySelector('#long-content');
            if (shortContent === null) {
                longContent.parentNode.removeChild(longContent);
            } else {
                shortContent.parentNode.removeChild(shortContent);
            }
            popupDiv.style.display = "none";
        }
        popupOkBtn.onclick = function () {
            var shortContentExist = document.querySelector("#short-content");
            if (localStorage.getItem("long-pop-up") === null) {
                fetchHtmlPage("long-pop-up")
                    .then(function (element) {
                        popupContainer.innerHTML += element;
                        setLocalStorageItem("long-pop-up", element);
                        var shortContent = document.querySelector('#short-content');
                        shortContent.parentNode.removeChild(shortContent)
                        setPageDIv();
                    });
            } else {
                if (shortContentExist === null) {
                    var longContent = document.querySelector('#long-content');
                    longContent.parentNode.removeChild(longContent)
                    setPopupDIv(localStorage.getItem("short-pop-up"));
                } else {
                    var shortContent = document.querySelector('#short-content');
                    shortContent.parentNode.removeChild(shortContent)
                    setPopupDIv(localStorage.getItem("long-pop-up"));
                }
            }
        }
    }

    initPageEvents = function () { // initialize page contents
        var togglePopupButton = document.getElementsByClassName("show-pop-up-btn")[0];
        togglePopupButton.onclick = function () {
            var shortPopupElement = localStorage.getItem("short-pop-up");
            if (shortPopupElement === null) {
                fetchHtmlPage("short-pop-up")
                    .then(function (element) {
                        popupContainer.innerHTML += element;
                        setLocalStorageItem("short-pop-up", element);
                        setPageDIv();
                    });
            } else {
                popupContainer.innerHTML += shortPopupElement;
                setPageDIv();
            }
        }
    }

    setLocalStorageItem = function (pageName, html) {
        localStorage.setItem(pageName, html);
    }

    setPageDIv = function () {
        var popupDiv = document.getElementById("pop-up");
        popupDiv.style.display = "block";
        initPopupEvents();
    }

    setPopupDIv = function (contentDiv) {
        popupContainer.innerHTML += contentDiv;
        var popupDiv = document.getElementById("pop-up");
        popupDiv.style.display = "block";
        initPopupEvents();
    }

    fetchHtmlPage("page-content") // load page html and show it
        .then(function (element) {
            pageContainer.innerHTML += element;
            setLocalStorageItem("page-content", element);
            initPageEvents();
        });
}
