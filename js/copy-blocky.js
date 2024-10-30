/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external ["wp","plugins"]
const external_wp_plugins_namespaceObject = window["wp"]["plugins"];
;// CONCATENATED MODULE: external ["wp","i18n"]
const external_wp_i18n_namespaceObject = window["wp"]["i18n"];
;// CONCATENATED MODULE: external ["wp","data"]
const external_wp_data_namespaceObject = window["wp"]["data"];
;// CONCATENATED MODULE: external ["wp","element"]
const external_wp_element_namespaceObject = window["wp"]["element"];
;// CONCATENATED MODULE: external ["wp","blocks"]
const external_wp_blocks_namespaceObject = window["wp"]["blocks"];
;// CONCATENATED MODULE: ./src/js/transformer.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


/**
 * Get a list of transformations in a to and from format
 */
var getTransformations = function getTransformations() {
  var dedup = new Set();
  return (0,external_wp_data_namespaceObject.select)('core/blocks').getBlockTypes().filter(function (x) {
    return x.transforms;
  }).reduce(function (t, _ref) {
    var name = _ref.name,
      transforms = _ref.transforms;
    return [].concat(_toConsumableArray(t), _toConsumableArray(transforms.from ? transforms.from.filter(function (x) {
      return x.blocks;
    }).reduce(function (t, _ref2) {
      var transform = _ref2.transform,
        __experimentalConvert = _ref2.__experimentalConvert,
        isMultiBlock = _ref2.isMultiBlock,
        isMatch = _ref2.isMatch,
        blocks = _ref2.blocks;
      return [].concat(_toConsumableArray(t), _toConsumableArray(blocks.map(function (b) {
        return {
          from: b,
          to: name,
          transform: transform || __experimentalConvert,
          experimental: !transform && !!__experimentalConvert,
          isMatch: isMatch,
          isMultiBlock: isMultiBlock
        };
      })));
    }, []) : []), _toConsumableArray(transforms.to ? transforms.to.filter(function (x) {
      return x.blocks;
    }).reduce(function (t, _ref3) {
      var transform = _ref3.transform,
        __experimentalConvert = _ref3.__experimentalConvert,
        isMultiBlock = _ref3.isMultiBlock,
        isMatch = _ref3.isMatch,
        blocks = _ref3.blocks;
      return [].concat(_toConsumableArray(t), _toConsumableArray(blocks.map(function (b) {
        return {
          from: name,
          to: b,
          transform: transform || __experimentalConvert,
          experimental: !transform && !!__experimentalConvert,
          isMatch: isMatch,
          isMultiBlock: isMultiBlock
        };
      })));
    }, []) : []));
  }, []).filter(function (x) {
    return x.transform;
  }).filter(function (_ref4) {
    var to = _ref4.to,
      from = _ref4.from;
    return !dedup.has("".concat(to, ",").concat(from)) && dedup.add("".concat(to, ",").concat(from));
  });
};

/**
 * Search the transformation list a determine a transformation path from the "from" to the "to" block
 */
var search = function search(lookupMap, from, to) {
  var _lookupMap$from, _lookupMap$;
  var queue = [];
  var alreadyFound = new Set();
  var enqueue = function enqueue(node) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (!alreadyFound.has(node)) {
      alreadyFound.add(node);
      queue.push(node);
      node.parents = parents;
      queue.sort(function (_ref5, _ref6) {
        var a = _ref5.experimental;
        var b = _ref6.experimental;
        return a ? 1 : b ? -1 : 0;
      });
    }
  };
  (_lookupMap$from = lookupMap[from]) === null || _lookupMap$from === void 0 ? void 0 : _lookupMap$from.forEach(function (n) {
    return enqueue(n);
  });
  (_lookupMap$ = lookupMap['*']) === null || _lookupMap$ === void 0 ? void 0 : _lookupMap$.forEach(function (n) {
    return enqueue(n);
  });
  var _loop = function _loop() {
    var _lookupMap$node$to;
    var node = queue.shift();
    if (node.to === to) {
      return {
        v: [].concat(_toConsumableArray(node.parents), [node])
      };
    }
    (_lookupMap$node$to = lookupMap[node.to]) === null || _lookupMap$node$to === void 0 ? void 0 : _lookupMap$node$to.forEach(function (n) {
      return enqueue(n, [].concat(_toConsumableArray(node.parents), [node]));
    });
  };
  while (queue.length > 0) {
    var _ret = _loop();
    if (_typeof(_ret) === "object") return _ret.v;
  }
};

/**
 * Search the all available transformations to determine a transformation path from the "from" to the "to" block
 * Including experimental transforations
 */
var transformationSearch = function transformationSearch(from, to) {
  var transformations = getTransformations();
  var lookupMap = {};
  transformations.forEach(function (t) {
    if (!lookupMap[t.from]) lookupMap[t.from] = [];
    lookupMap[t.from].push(t);
  });
  return search(lookupMap, from, to);
};
;// CONCATENATED MODULE: ./src/js/paste.js
var _window$copyBlocky;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = paste_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function paste_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return paste_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return paste_arrayLikeToArray(o, minLen); }
function paste_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



window.copyBlocky = _objectSpread(_objectSpread({}, (_window$copyBlocky = window.copyBlocky) !== null && _window$copyBlocky !== void 0 ? _window$copyBlocky : {}), {}, {
  debugging: false
});

/**
 * Using the templated block determine attributes which should not be copied, ex. the content
 */
var getInvalidKeys = function getInvalidKeys(block) {
  var _select = (0,external_wp_data_namespaceObject.select)('core/blocks'),
    getBlockType = _select.getBlockType;
  var copyBlockType = getBlockType(block.name);
  var validKeys = Object.keys(copyBlockType.attributes).filter(function (x) {
    var _copyBlockType$attrib;
    return ((_copyBlockType$attrib = copyBlockType.attributes[x]) === null || _copyBlockType$attrib === void 0 ? void 0 : _copyBlockType$attrib.source) !== 'html';
  });
  return Object.keys(block.attributes).filter(function (x) {
    return !validKeys.includes(x);
  });
};

/**
 * Determine how the blocks should be copied.
 * This may be just the attributes, ex. if the block types are the same
 * If different block types try and use a transformation method
 * If There is no available transformation, try a generic attribute copy
 */
var updateAndMergeBlock = function updateAndMergeBlock(blockId, copyBlock, pasteBlock) {
  var _select2 = (0,external_wp_data_namespaceObject.select)('core/blocks'),
    getBlockType = _select2.getBlockType;
  var _select3 = (0,external_wp_data_namespaceObject.select)('core/block-editor'),
    getBlockParents = _select3.getBlockParents,
    getBlock = _select3.getBlock;
  var _dispatch = (0,external_wp_data_namespaceObject.dispatch)('core/block-editor'),
    replaceBlock = _dispatch.replaceBlock,
    updateBlock = _dispatch.updateBlock;
  var invalidKeys = getInvalidKeys(copyBlock);
  if (pasteBlock.name === copyBlock.name) {
    // If this is the same block copy attributes
    if (window.copyBlocky.debugging) console.log('Blocks are the same type');
    if (window.copyBlocky.debugging) console.log('copyBlock', copyBlock);
    var attributes = _objectSpread({}, copyBlock.attributes);
    // Remove invalid attributes
    var _iterator = _createForOfIteratorHelper(invalidKeys),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        delete attributes[key];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (window.copyBlocky.debugging) console.log({
      attributes: attributes,
      invalidKeys: invalidKeys
    });
    // Set the block attributes
    updateBlock(blockId, {
      attributes: attributes
    });
  } else {
    // Check for parents if this block cant be transformed
    var transformers = transformationSearch(pasteBlock.name, copyBlock.name);
    var copyBlockType = getBlockType(copyBlock.name);
    var pasteBlockType = getBlockType(copyBlock.name);
    while (!transformers && (copyBlockType.parent || pasteBlockType.parent)) {
      if (window.copyBlocky.debugging) console.log('No transformer found, checking for parent blocks');

      // TODO: Theoretically, the current block could match to the parent of the other or vice versa, in practice this shouldn't matter, at least for built in blocks

      // Check if the copy block has a parent
      var parents = getBlockParents(copyBlock.clientId);
      if (window.copyBlocky.debugging) console.log('copyBlock', copyBlock);
      if (parents.length === 0) break; // Shouldn't happen, unless block is invalid
      copyBlock = getBlock(parents[parents.length - 1]);
      if (window.copyBlocky.debugging) console.log('copyBlock parent', copyBlock, parents);
      copyBlockType = getBlockType(copyBlock.name);

      // Check if the paste block has a parent
      parents = getBlockParents(pasteBlock.clientId);
      if (window.copyBlocky.debugging) console.log('pasteBlock', pasteBlock);
      if (parents.length === 0) break; // Shouldn't happen, unless block is invalid
      pasteBlock = getBlock(parents[parents.length - 1]);
      if (window.copyBlocky.debugging) console.log('pasteBlock parent', copyBlock, parents);
      pasteBlockType = getBlockType(pasteBlock.name);

      // Check if transformer exists for this block set
      transformers = transformationSearch(pasteBlock.name, copyBlock.name);
      invalidKeys = getInvalidKeys(copyBlock);
    }
    if (window.copyBlocky.debugging) console.log('invalidKeys', invalidKeys);
    // There is a valid tranformation path
    if (transformers) {
      if (window.copyBlocky.debugging) console.log("Transformer Found for ".concat(pasteBlock.name, " -> ").concat(copyBlock.name), transformers);
      if (window.copyBlocky.debugging) console.log('pasteBlock', pasteBlock);
      if (window.copyBlocky.debugging) console.log('copyBlock', copyBlock);
      var block = pasteBlock;
      // TODO: may need to add isMatch to the transformationSearch and filter out transforms which wouldn't work
      var _iterator2 = _createForOfIteratorHelper(transformers),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _step2.value,
            transform = _step2$value.transform,
            isMultiBlock = _step2$value.isMultiBlock,
            isMatch = _step2$value.isMatch,
            experimental = _step2$value.experimental;
          if (experimental) {
            block = transform([block]);
          } else if (isMultiBlock) {
            var _block$attributes, _block$innerBlocks;
            block = transform([(_block$attributes = block.attributes) !== null && _block$attributes !== void 0 ? _block$attributes : {}], [(_block$innerBlocks = block.innerBlocks) !== null && _block$innerBlocks !== void 0 ? _block$innerBlocks : []]);
          } else {
            var _block$attributes2, _block$innerBlocks2;
            block = transform((_block$attributes2 = block.attributes) !== null && _block$attributes2 !== void 0 ? _block$attributes2 : {}, (_block$innerBlocks2 = block.innerBlocks) !== null && _block$innerBlocks2 !== void 0 ? _block$innerBlocks2 : []);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _attributes = _objectSpread({}, copyBlock.attributes);
      // Remove invalid attributes
      var _iterator3 = _createForOfIteratorHelper(invalidKeys),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _key = _step3.value;
          delete _attributes[_key];
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      if (Array.isArray(block)) block.forEach(function (b) {
        b.attributes = _objectSpread(_objectSpread({}, b.attributes), _attributes);
      });else block.attributes = _objectSpread(_objectSpread({}, block.attributes), _attributes);
      if (window.copyBlocky.debugging) console.log('New Block', block);
      // replace the current block with the transformed block
      replaceBlock(blockId, block);
    } else {
      if (window.copyBlocky.debugging) console.log('No Transformer');
      if (window.copyBlocky.debugging) console.log('pasteBlock', pasteBlock);
      if (window.copyBlocky.debugging) console.log('copyBlock', copyBlock);
      /* const content = getBlockContent(pasteBlock); */

      // TODO: Better content copying, ex. list to button

      // Copy the attribute to the new block
      var _attributes2 = _objectSpread({}, copyBlock.attributes);
      var oldAttributes = _objectSpread({}, pasteBlock.attributes);
      // Remove invalid attributes
      var _iterator4 = _createForOfIteratorHelper(invalidKeys),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _key2 = _step4.value;
          delete _attributes2[_key2];
        }
        // Set the new block type and attributes
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      updateBlock(blockId, {
        attributes: _objectSpread(_objectSpread({}, oldAttributes), _attributes2),
        name: copyBlock.name
      });
      if (window.copyBlocky.debugging) console.log('New Attributes', {
        attributes: _objectSpread(_objectSpread({}, oldAttributes), _attributes2)
      });
    }
  }
};

/**
 * Start the paste procedure, this may be one or more blocks depending on what was copied and what is selected for pasting
 */
var pasteCopiedBlocks = function pasteCopiedBlocks() {
  var _select4 = (0,external_wp_data_namespaceObject.select)('copy-blocky/data'),
    getCopiedBlocks = _select4.getCopiedBlocks;
  var copiedData = getCopiedBlocks();
  var _select5 = (0,external_wp_data_namespaceObject.select)('core/block-editor'),
    getBlock = _select5.getBlock,
    getSelectedBlockClientIds = _select5.getSelectedBlockClientIds;
  var _dispatch2 = (0,external_wp_data_namespaceObject.dispatch)('core/block-editor'),
    clearSelectedBlock = _dispatch2.clearSelectedBlock;
  if (copiedData.length == 0) return null;
  var oneBlockSelected = copiedData.length === 1;
  var pasteBlockIds = getSelectedBlockClientIds();
  if (pasteBlockIds) {
    if (oneBlockSelected) {
      // If only one copied block, apply it to all pasted blocks
      var copiedBlock = copiedData[0];
      pasteBlockIds.forEach(function (blockId) {
        updateAndMergeBlock(blockId, copiedBlock, getBlock(blockId));
      });
    } else {
      // For Each copied block attempt to align it with a block for pasting
      copiedData.forEach(function (copiedBlock, i) {
        if (pasteBlockIds[i]) updateAndMergeBlock(pasteBlockIds[i], copiedBlock, getBlock(pasteBlockIds[i]));
      });
    }
    clearSelectedBlock();
  }
};
;// CONCATENATED MODULE: external ["wp","keycodes"]
const external_wp_keycodes_namespaceObject = window["wp"]["keycodes"];
;// CONCATENATED MODULE: ./src/js/store.js
function store_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function store_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? store_ownKeys(Object(source), !0).forEach(function (key) { store_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : store_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function store_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  copiedBlocks: []
};
var actions = {
  setCopiedBlocks: function setCopiedBlocks(copiedBlocks) {
    return {
      type: 'SET_COPIED_BLOCKS',
      copiedBlocks: copiedBlocks
    };
  }
};

/**
 * Create a store to save copied blocks to
 */
var store = (0,external_wp_data_namespaceObject.createReduxStore)('copy-blocky/data', {
  reducer: function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    switch (action.type) {
      case 'SET_COPIED_BLOCKS':
        return store_objectSpread(store_objectSpread({}, state), {}, {
          copiedBlocks: action.copiedBlocks
        });
    }
    return state;
  },
  actions: actions,
  selectors: {
    getCopiedBlocks: function getCopiedBlocks(state, item) {
      var copiedBlocks = state.copiedBlocks;
      return copiedBlocks;
    }
  }
});
(0,external_wp_data_namespaceObject.register)(store);
;// CONCATENATED MODULE: external ["wp","editPost"]
const external_wp_editPost_namespaceObject = window["wp"]["editPost"];
;// CONCATENATED MODULE: external ["wp","primitives"]
const external_wp_primitives_namespaceObject = window["wp"]["primitives"];
;// CONCATENATED MODULE: ./node_modules/@wordpress/icons/build-module/library/replace.js


/**
 * WordPress dependencies
 */

const replace = (0,external_wp_element_namespaceObject.createElement)(external_wp_primitives_namespaceObject.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,external_wp_element_namespaceObject.createElement)(external_wp_primitives_namespaceObject.Path, {
  d: "M16 10h4c.6 0 1-.4 1-1V5c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1zm-8 4H4c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-4c0-.6-.4-1-1-1zm10-2.6L14.5 15l1.1 1.1 1.7-1.7c-.1 1.1-.3 2.3-.9 2.9-.3.3-.7.5-1.3.5h-4.5v1.5H15c.9 0 1.7-.3 2.3-.9 1-1 1.3-2.7 1.4-4l1.8 1.8 1.1-1.1-3.6-3.7zM6.8 9.7c.1-1.1.3-2.3.9-2.9.4-.4.8-.6 1.3-.6h4.5V4.8H9c-.9 0-1.7.3-2.3.9-1 1-1.3 2.7-1.4 4L3.5 8l-1 1L6 12.6 9.5 9l-1-1-1.7 1.7z"
}));
/* harmony default export */ const library_replace = (replace);
//# sourceMappingURL=replace.js.map
;// CONCATENATED MODULE: ./src/js/menu-item.js






/**
 * Add a paste styles button to the context menu
 */
var copyBlockyMenuPluggin = function copyBlockyMenuPluggin() {
  return wp.element.createElement(external_wp_editPost_namespaceObject.PluginBlockSettingsMenuItem, {
    icon: library_replace,
    label: (0,external_wp_i18n_namespaceObject.__)('Paste Styles', 'copy-blocky'),
    onClick: pasteCopiedBlocks
  });
};
(0,external_wp_plugins_namespaceObject.registerPlugin)('copy-blocky-menu-item', {
  render: copyBlockyMenuPluggin
});
;// CONCATENATED MODULE: ./src/js/copy-blocky.js









/**
 * Store copied blocks in redux
 */
var copySelectedBlocks = function copySelectedBlocks() {
  var _select = (0,external_wp_data_namespaceObject.select)('core/block-editor'),
    getBlock = _select.getBlock,
    getSelectedBlockClientIds = _select.getSelectedBlockClientIds;
  var _dispatch = (0,external_wp_data_namespaceObject.dispatch)('copy-blocky/data'),
    setCopiedBlocks = _dispatch.setCopiedBlocks;
  var blockIds = getSelectedBlockClientIds();
  setCopiedBlocks(blockIds.map(function (blockId) {
    return getBlock(blockId);
  }));
};

/**
 * Create a copy listener for storing the blocks, and a paste listener
 */
var copyBlocky = function copyBlocky() {
  (0,external_wp_element_namespaceObject.useEffect)(function () {
    var pasteEvent = function pasteEvent(e) {
      var eventModifier = Object.keys(external_wp_keycodes_namespaceObject.isKeyboardEvent).find(function (eventModifier) {
        return external_wp_keycodes_namespaceObject.isKeyboardEvent[eventModifier](e, e.key);
      });
      if (eventModifier == window.copyBlocky.hotkeyModifier && e.key === window.copyBlocky.hotkeyKey) {
        pasteCopiedBlocks();
        e.preventDefault();
      }
    };
    document.addEventListener('copy', copySelectedBlocks);
    document.addEventListener('keydown', pasteEvent);
    var shortcutName = (0,external_wp_i18n_namespaceObject.__)('Paste Styles', 'copy-blocky');
    var description = (0,external_wp_i18n_namespaceObject.__)('Paste the styles of a copied block', 'copy-blocky');
    var _dispatch2 = (0,external_wp_data_namespaceObject.dispatch)('core/keyboard-shortcuts'),
      registerShortcut = _dispatch2.registerShortcut,
      unregisterShortcut = _dispatch2.unregisterShortcut;
    registerShortcut({
      name: shortcutName,
      category: 'block',
      description: description,
      keyCombination: {
        modifier: window.copyBlocky.hotkeyModifier,
        character: window.copyBlocky.hotkeyKey
      }
    });
    return function () {
      unregisterShortcut(shortcutName);
      document.removeEventListener('copy', copySelectedBlocks);
      document.removeEventListener('keydown', pasteEvent);
    };
  }, []);
  return null;
};
(0,external_wp_plugins_namespaceObject.registerPlugin)('copy-blocky', {
  render: copyBlocky
});
/******/ })()
;