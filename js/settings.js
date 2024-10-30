/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external ["wp","keycodes"]
const external_wp_keycodes_namespaceObject = window["wp"]["keycodes"];
;// CONCATENATED MODULE: ./src/js/settings.js
var _window$copyBlocky;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.getElementById('copy-blocky_setting_hotkey_modifier').parentNode.parentNode.style = 'display:none';
document.getElementById('copy-blocky_setting_hotkey_key').parentNode.parentNode.style = 'display:none';
var getKey = function getKey(e) {
  var eventModifier = Object.keys(external_wp_keycodes_namespaceObject.isKeyboardEvent).find(function (eventModifier) {
    return external_wp_keycodes_namespaceObject.isKeyboardEvent[eventModifier](e, e.key);
  });
  if (e.key === 'Alt' || e.key === 'Control' || e.key === 'Shift') return;
  var keyPath = [e.ctrlKey ? 'ctrl' : '', e.shiftKey ? 'shift' : '', e.altKey ? 'alt' : '', e.key].filter(function (x) {
    return x != '';
  });
  document.getElementById('copy-blocky_setting_hotkey').value = keyPath.join('+');
  document.getElementById('copy-blocky_setting_hotkey_modifier').value = eventModifier;
  document.getElementById('copy-blocky_setting_hotkey_key').value = e.key;
  document.getElementById('copy-blocky_setting_hotkey_error').innerText = keyPath.length == 1 ? 'It is recommended to include a modifier (such as ctrl, alt, shift) with your hotkey.' : '';
  e.preventDefault();
};
window.copyBlocky = _objectSpread(_objectSpread({}, (_window$copyBlocky = window.copyBlocky) !== null && _window$copyBlocky !== void 0 ? _window$copyBlocky : {}), {}, {
  getKey: getKey
});
/******/ })()
;