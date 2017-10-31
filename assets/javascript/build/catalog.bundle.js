/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 46);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initChosen = initChosen;
/**
 * Helper for init single chosen select
 * @param {string} selector - jquery selector
 * @param {object} [config] - chosen plugin config is optional
 */
function initChosen(selector, config) {
	$(selector).chosen(config);

	if ($(selector).length > 0) {
		$(selector).on('touchstart', function (e) {
			e.stopPropagation();e.preventDefault();
			$(this).trigger('mousedown');
		});
	}
}

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.header = header;

var _lowvision = __webpack_require__(2);

var _chosen = __webpack_require__(0);

var _slideToggle = __webpack_require__(3);

var _fileinfoshow = __webpack_require__(4);

var _search = __webpack_require__(5);

var _searchanim = __webpack_require__(6);

var _menuanim = __webpack_require__(7);

var _sitemap = __webpack_require__(8);

function header() {
	(0, _chosen.initChosen)('.custom-select', { disable_search: true });
	$('.daterange').datepicker({
		format: 'dd.mm.yyyy',
		language: 'uk'
	});
	(0, _menuanim.menuAnim)();
	(0, _searchanim.searchAnim)();
	(0, _slideToggle.slideToggle)('.slideToogle');
	(0, _fileinfoshow.fileinfoshow)();
	(0, _search.searchSubmith)();
	(0, _lowvision.lowvision)();
	setTimeout(function () {
		(0, _sitemap.sitemap)();
	}, 1000);

	var maindescription = $('.editor-content p:first-child');

	if (maindescription.find('a').length === 0 && maindescription.find('table').length === 0 && maindescription.find('tr').length === 0 && maindescription.find('td').length === 0 && maindescription.find('ol').length === 0 && maindescription.find('ul').length === 0 && maindescription.find('li').length === 0 && maindescription.find('h1').length === 0 && maindescription.find('h2').length === 0 && maindescription.find('h3').length === 0 && maindescription.find('h4').length === 0 && maindescription.find('h5').length === 0 && maindescription.find('h6').length === 0 && maindescription.find('strong').length === 0 && maindescription.find('video').length === 0 && maindescription.find('blockquote').length === 0) {
		$('.editor-content').addClass('with-bukvica');
	} else {
		$('.editor-content').removeClass('with-bukvica');
	}
}

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.lowvision = lowvision;
function lowvision() {

	var changeVisionBtn = document.getElementById('changeVision');
	var changeVisionBtnSpan = document.querySelector('#changeVision span');
	var fontOption = void 0;

	function checkVision() {
		if (localStorage.getItem('lowvision') === 'on') {
			document.body.classList.add('lowvision');
			changeVisionBtnSpan.innerHTML = 'Стандартна версія';
		} else {
			document.body.classList.remove('lowvision');
			localStorage.setItem('fontSize', 1);
			changeVisionBtnSpan.innerHTML = 'Версія для людей з вадами зору';
		}
	}

	function changeVision() {
		if (localStorage.getItem('lowvision') === 'on') {
			localStorage.setItem('lowvision', 'off');
		} else {
			localStorage.setItem('lowvision', 'on');
		}
		checkVision();
	}

	function plusFontSize() {
		return fontOption++;
	}

	function minusFontSize() {
		return fontOption--;
	}

	function checkFont() {
		if (localStorage.getItem('lowvision') === 'on') {
			localStorage.setItem('fontSize', fontOption);
		} else {
			localStorage.setItem('fontSize', 1);
		}
		if (fontOption == 0) {
			$('body').css('font-size', '14px');
			$('.js_font_minus').addClass('font-btn-dis');
		} else if (fontOption == 1) {
			$('body').css('font-size', '');
		} else if (fontOption == 2) {
			$('body').css('font-size', '16.5px');
		} else if (fontOption == 3) {
			$('body').css('font-size', '17px');
		} else if (fontOption == 4) {
			$('body').css('font-size', '17.5px');
			$('.js_font_plus').addClass('font-btn-dis');
		}
	}

	if (localStorage.getItem('fontSize') === null) {
		localStorage.setItem('fontSize', 1);
	} else {
		fontOption = Number(localStorage.getItem('fontSize'));
		checkFont();
	}
	changeVisionBtn.onclick = function () {
		changeVision();
	};

	setTimeout(function () {
		var changeVisionFooter = document.getElementById('changeVisionFooter');
		if (changeVisionFooter) {
			changeVisionFooter.onclick = function () {
				changeVision();
			};
		}
	}, 1000);

	$('.js_font_minus').click(function () {
		minusFontSize();
		checkFont();
		$('.js_font_plus').removeClass('font-btn-dis');
	});
	$('.js_font_plus').click(function () {
		plusFontSize();
		checkFont();
		$('.js_font_minus').removeClass('font-btn-dis');
	});
	checkVision();
}

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.slideToggle = slideToggle;
function slideToggle(el) {

	var element = $(el);

	if (!element) {
		return;
	}

	var _loop = function _loop(i) {
		var _this = element[i];
		$(_this).on('click', function () {
			if ($(_this).hasClass('active')) {
				$(_this).removeClass('active');
				$(_this).next().slideUp();
				return;
			}
			$(element[i]).removeClass('active');
			$(_this).addClass('active');
			$(_this).next().slideDown();
		});
	};

	for (var i = 0; i < element.length; i++) {
		_loop(i);
	}
}

/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fileinfoshow = fileinfoshow;
function fileinfoshow() {

	var downloadLinks = document.querySelectorAll('a.fr-file');

	if (downloadLinks.length !== 0) {
		for (var i = 0; i < downloadLinks.length; i++) {
			var addInfo = document.createElement('span');

			var extension = downloadLinks[i].getAttribute('data-extension');
			var size = downloadLinks[i].getAttribute('data-size');

			var sizeName = void 0;
			var countedSize = void 0;

			if (size >= 1000000) {
				sizeName = 'Мб';
				countedSize = size / 1000000;
			} else if (size < 1000000) {
				sizeName = 'Кб';
				countedSize = size / 1000;
			}

			addInfo.className = 'link-addition-info';
			addInfo.innerHTML = ' ( .' + extension + ' , ' + countedSize.toFixed(2) + ' ' + sizeName + ' )';
			downloadLinks[i].appendChild(addInfo);
		}
	}
}

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _header = __webpack_require__(1);

var _footer = __webpack_require__(9);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Catalog = function () {
	function Catalog() {
		_classCallCheck(this, Catalog);

		this.initModules();
	}

	_createClass(Catalog, [{
		key: 'initModules',
		value: function initModules() {
			(0, _header.header)();
			(0, _footer.footer)();
		}
	}]);

	return Catalog;
}();

new Catalog();

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.searchSubmith = searchSubmith;
function searchSubmith() {

	var searchPortalForm = document.getElementById('searchPortalForm');
	var searchNPAForm = document.getElementById('searchNPAForm');

	if (localStorage.getItem('searchKey') === null) {
		localStorage.setItem('searchKey', '');
	}
	if (localStorage.getItem('searchKey') !== null) {
		searchPortalForm.elements.key.value = localStorage.getItem('searchKey');
		searchNPAForm.elements.key.value = localStorage.getItem('searchKey');
	}
	searchPortalForm.onsubmit = function () {
		localStorage.setItem('searchKey', this.elements.key.value);
	};
	searchNPAForm.onsubmit = function () {
		localStorage.setItem('searchKey', this.elements.key.value);
		localStorage.setItem('searchKeyNpa', $('#searchNPAForm').serialize());
	};
}

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.searchAnim = searchAnim;
function searchAnim() {

	var searchShowBtn = document.getElementById('searchShow');
	var searchPortal = document.getElementById('searchPortal');
	var searchNPA = document.getElementById('searchNPA');
	var searchPortalForm = document.getElementById('searchPortalForm');
	var searchNPAForm = document.getElementById('searchNPAForm');
	var closeSearch = document.getElementById('closeSearch');

	function showLinks() {
		if (this.classList.value.indexOf('active') !== -1) {
			this.classList.remove('active');
		} else {
			this.classList.add('active');
		}
	}
	function closeSearchSm() {
		searchShowBtn.classList.remove('active');
		document.body.classList.remove('active');
	}
	function showPortalForm() {
		searchNPA.classList.remove('active');
		searchNPAForm.classList.remove('active');
		searchPortal.classList.add('active');
		searchPortalForm.classList.add('active');
	}
	function showNPAForm() {
		searchNPA.classList.add('active');
		searchNPAForm.classList.add('active');
		searchPortal.classList.remove('active');
		searchPortalForm.classList.remove('active');
	}
	searchShowBtn.addEventListener('click', showLinks, false);

	if (window.innerWidth <= 992) {
		searchShowBtn.onclick = function () {
			document.body.classList.add('active');
			$('html, body').animate({
				scrollTop: 0
			}, 500);
		};
	}

	searchPortal.onclick = function () {
		showPortalForm();
	};
	searchNPA.onclick = function () {
		showNPAForm();
	};
	closeSearch.onclick = function () {
		closeSearchSm();
	};

	$(document).mouseup(function (e) {
		var container = $('.search-form');
		var container2 = $('#searchShow');
		var container3 = $('.datepicker-dropdown');
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			if (!container2.is(e.target) && container2.has(e.target).length === 0) {
				if (!container3.is(e.target) && container3.has(e.target).length === 0) {
					container2.removeClass('active');
				}
			}
		}
	});
}

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.menuAnim = menuAnim;
function menuAnim() {

	var showSubSubmenu = document.querySelectorAll('.showSubSubmenu');
	var menuSm = document.getElementById('menuSm');
	var shomMenuSm = document.getElementById('shomMenuSm');
	var closeMenuSm = document.querySelectorAll('.closeMenuSm');
	var backMenuSm = document.querySelectorAll('.backMenu');
	var searchShowBtn = document.getElementById('searchShow');

	function showLinks() {
		if (this.classList.value.indexOf('active') !== -1) {
			this.classList.remove('active');
		} else {
			this.classList.add('active');
		}
	}
	$('.showSubmenu').click(function () {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$('.showSubmenu').removeClass('active');
			$(this).addClass('active');
		}
	});

	shomMenuSm.onclick = function () {
		menuSm.classList.add('active');
		document.body.classList.add('active');
		searchShowBtn.classList.add('hidden-search');
	};
	for (var i = 0; i < showSubSubmenu.length; i++) {
		showSubSubmenu[i].addEventListener('click', showLinks, false);
	}
	for (var _i = 0; _i < backMenuSm.length; _i++) {
		backMenuSm[_i].addEventListener('click', function () {
			this.parentElement.parentElement.previousElementSibling.classList.remove('active');
		}, false);
	}
	for (var _i2 = 0; _i2 < closeMenuSm.length; _i2++) {
		closeMenuSm[_i2].addEventListener('click', function () {
			menuSm.classList.remove('active');
			document.body.classList.remove('active');
			searchShowBtn.classList.remove('hidden-search');
		}, false);
	}
	$(document).mouseup(function (e) {
		var container = $('.submenu');
		var container2 = $('.menu');
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			if (!container2.is(e.target) && container2.has(e.target).length === 0) {
				container.prev().removeClass('active');
			}
		}
	});

	var scrollToTop = '.scrollToTop';

	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$(scrollToTop).fadeIn();
		} else {
			$(scrollToTop).fadeOut();
		}
	});
	setTimeout(function () {
		window.onload = function () {
			$(scrollToTop).click(function () {
				$('html, body').animate({
					scrollTop: 0
				}, 500);
				return false;
			});
		};
	}, 1000);
}

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sitemap = sitemap;
function sitemap() {

	var showSiteMap = document.querySelector('.site-map-title');
	var mapContent = document.querySelector('.map-content');

	function showMap() {
		if (mapContent.classList.value.indexOf('active') !== -1 && this.classList.value.indexOf('active') !== -1) {
			mapContent.classList.remove('active');
			this.classList.remove('active');
		} else {
			mapContent.classList.add('active');
			this.classList.add('active');
		}
	}

	if (showSiteMap) {
		showSiteMap.addEventListener('click', showMap, false);
	}
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.footer = footer;
function footer() {}

/***/ })

/******/ });