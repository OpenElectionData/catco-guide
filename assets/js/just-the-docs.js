// Event handling

function addEvent(el, type, handler) {
  if (el.attachEvent) el.attachEvent("on" + type, handler);
  else el.addEventListener(type, handler);
}
function removeEvent(el, type, handler) {
  if (el.detachEvent) el.detachEvent("on" + type, handler);
  else el.removeEventListener(type, handler);
}

// Show/hide mobile menu

function toggleNav() {
  const nav = document.querySelector(".js-main-nav");
  const auxNav = document.querySelector(".js-aux-nav");
  const navTrigger = document.querySelector(".js-main-nav-trigger");
  const search = document.querySelector(".js-search");

  addEvent(navTrigger, "click", function() {
    var text = navTrigger.innerText;
    var textToggle = navTrigger.getAttribute("data-text-toggle");

    nav.classList.toggle("nav-open");
    navTrigger.classList.toggle("nav-open");
    search.classList.toggle("nav-open");
    navTrigger.innerText = textToggle;
    navTrigger.setAttribute("data-text-toggle", text);
    textToggle = text;

    if (auxNav) {
      auxNav.classList.toggle("nav-open");
    }
  });
}

// Site search

function initSearch() {
  var searchInput = document.querySelector(".js-search-input");

  if (!searchInput) {
    return;
  }

  var index = lunr(function() {
    this.ref("id");
    this.field("title", { boost: 20 });
    this.field("content", { boost: 10 });
    this.field("url");
  });

  // Get the generated search_data.json file so lunr.js can search it locally.

  sc = document.getElementsByTagName("script");
  source = "";

  for (idx = 0; idx < sc.length; idx++) {
    s = sc.item(idx);

    if (s.src && s.src.match(/just-the-docs\.js$/)) {
      source = s.src;
    }
  }

  jsPath = source.replace("just-the-docs.js", "");

  jsonPath = jsPath + "search-data.json";

  var request = new XMLHttpRequest();
  request.open("GET", jsonPath, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      var keys = Object.keys(data);

      for (var i in data) {
        index.add({
          id: data[i].id,
          title: data[i].title,
          excerpt: data[i].excerpt,
          content: data[i].content,
          url: data[i].url
        });
      }
      searchResults(data);
    } else {
      // We reached our target server, but it returned an error
      console.log(
        "Error loading ajax request. Request status:" + request.status
      );
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("There was a connection error");
  };

  request.send();

  function searchResults(dataStore) {
    var searchInput = document.querySelector(".js-search-input");
    var searchResults = document.querySelector(".js-search-results");
    var store = dataStore;

    function hideResults() {
      searchResults.innerHTML = "";
      searchResults.classList.remove("active");
    }

    addEvent(searchInput, "keyup", function(e) {
      var query = this.value;

      searchResults.innerHTML = "";
      searchResults.classList.remove("active");

      if (query === "") {
        hideResults();
      } else {
        var results = index.search(query);

        if (results.length > 0) {
          searchResults.classList.add("active");
          var resultsList = document.createElement("ul");
          searchResults.appendChild(resultsList);

          for (var i in results) {
            var resultsListItem = document.createElement("li");
            var resultsLink = document.createElement("a");
            var resultsDesc = document.createElement("span");
            var resultsUrl = store[results[i].ref].url;
            var resultsTitle = store[results[i].ref].title;
            var resultsExcerpt = store[results[i].ref].excerpt;

            resultsLink.setAttribute("href", resultsUrl);
            resultsLink.innerText = resultsTitle;
            resultsDesc.innerText = resultsExcerpt;

            resultsList.classList.add("search-results-list");
            resultsListItem.classList.add("search-results-list-item");
            resultsLink.classList.add("search-results-link");
            resultsDesc.classList.add("fs-2", "text-grey-dk-000", "d-block");

            resultsList.appendChild(resultsListItem);
            resultsListItem.appendChild(resultsLink);
            resultsLink.appendChild(resultsDesc);
          }
        }

        // When esc key is pressed, hide the results and clear the field
        if (e.keyCode == 27) {
          hideResults();
          searchInput.value = "";
        }
      }
    });

    addEvent(searchInput, "blur", function() {
      setTimeout(function() {
        hideResults();
      }, 300);
    });
  }
}

// Print PDF
function printPDF() {
  var pdfBtns = document.querySelectorAll(".btn--pdf");
  Array.from(pdfBtns).forEach(btn => {
    btn.addEventListener("click", function() {
      var doc = new jsPDF();

      var pageTitle = document
        .querySelector(".page__title")
        .getAttribute("data-title");
      var title = doc.splitTextToSize(
        "Raising Voices in Closed Spaces Guide",
        130
      );
      var subtitle = doc.splitTextToSize(pageTitle, 150);

      var yPos =
        doc.getTextDimensions(title).h + doc.getTextDimensions(subtitle).h + 22;

      var id = this.getAttribute("data-id");
      var bodyRows = [];

      if (id === "printAll" || id.startsWith("group__")) {
        var selector = "";
        if (id.startsWith("group__")) {
          selector = "#" + id + " ";
        }

        var textareas = document.querySelectorAll(
          selector + ".form-default .form-textarea"
        );

        Array.from(textareas).forEach(textarea => {
          var textareaId = textarea.getAttribute("id");
          var label = document.querySelector('label[for="' + textareaId + '"]')
            .innerHTML;
          var content = textarea.value;

          bodyRows.push({ "[0]": label });
          bodyRows.push({ "[0]": content });
        });
      } else {
        var label = document.querySelector('label[for="' + id + '"]').innerHTML;
        var content = document.getElementById(id).value;

        bodyRows.push({ "[0]": label });
        bodyRows.push({ "[0]": content });
      }

      doc.autoTable({
        columns: [{ dataKey: "[0]", header: "Your Responses" }],
        body: bodyRows,
        rowPageBreak: "auto",
        tableWidth: "auto",
        showHead: "never",
        margin: { top: yPos, right: 9, bottom: 9, left: 9 },
        bodyStyles: { valign: "top" },
        theme: "plain",
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          rowPageBreak: "avoid",
          halign: "left",
          fontSize: "12"
        },
        columnStyles: {
          "[0]": { halign: "left", cellWidth: "auto" }
        },
        alternateRowStyles: {
          fontStyle: "bold",
          fontSize: "14",
          cellPadding: { top: 10 }
        },
        didDrawPage: function(data) {
          doc.setFontSize(22);
          doc.setFontStyle("bold");
          doc.text(title, 10, 15);

          doc.setFontSize(18);
          doc.setFontStyle("bold");
          doc.text(subtitle, 10, 25);

          doc.addImage(
            "data:image/jpeg;base64,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",
            "JPEG",
            0,
            yPos,
            250,
            2
          );

          // Footer
          doc.setFontSize(10);
          doc.setFontStyle("normal");
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.text("https://raiseavoice.org", 10, pageHeight - 10);
        }
      });

      doc.save("raising-voices-" + pageTitle + ".pdf");
    });
  });
}

// Document ready

function ready() {
  toggleNav();
  printPDF();
  if (typeof lunr !== "undefined") {
    initSearch();
  }
}

// in case the document is already rendered
if (document.readyState != "loading") ready();
// modern browsers
else if (document.addEventListener)
  document.addEventListener("DOMContentLoaded", ready);
// IE <= 8
else
  document.attachEvent("onreadystatechange", function() {
    if (document.readyState == "complete") ready();
  });
