/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("const dropdownBtn = document.getElementById(\"btnLogin\");\r\nconst dropdownMenu = document.getElementById(\"dropdown\");\r\nconst toggleArrow = document.getElementById(\"arrow\");\r\n// const volunteerBtn = document.getElementById(\"btnVol\");\r\n// const organizationBtn = document.getElementById(\"btnOrg\");\r\n\r\nconst toggleDropdown = function () {\r\n    dropdownMenu.classList.toggle(\"show\");\r\n    toggleArrow.classList.toggle(\"arrow\");\r\n};\r\n\r\ndropdownBtn.addEventListener(\"click\", function (e) {\r\n    e.stopPropagation();\r\n    toggleDropdown();\r\n});\r\n\r\ndocument.documentElement.addEventListener(\"click\", function () {\r\n    if (dropdownMenu.classList.contains(\"show\")) {\r\n        toggleDropdown();\r\n    }\r\n});\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnJpZGdlLy4vc3JjL2luZGV4LmpzP2I2MzUiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZHJvcGRvd25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bkxvZ2luXCIpO1xyXG5jb25zdCBkcm9wZG93bk1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRyb3Bkb3duXCIpO1xyXG5jb25zdCB0b2dnbGVBcnJvdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJyb3dcIik7XHJcbi8vIGNvbnN0IHZvbHVudGVlckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuVm9sXCIpO1xyXG4vLyBjb25zdCBvcmdhbml6YXRpb25CdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bk9yZ1wiKTtcclxuXHJcbmNvbnN0IHRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZHJvcGRvd25NZW51LmNsYXNzTGlzdC50b2dnbGUoXCJzaG93XCIpO1xyXG4gICAgdG9nZ2xlQXJyb3cuY2xhc3NMaXN0LnRvZ2dsZShcImFycm93XCIpO1xyXG59O1xyXG5cclxuZHJvcGRvd25CdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgdG9nZ2xlRHJvcGRvd24oKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChkcm9wZG93bk1lbnUuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2hvd1wiKSkge1xyXG4gICAgICAgIHRvZ2dsZURyb3Bkb3duKCk7XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;