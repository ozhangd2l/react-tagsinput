(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('ReactTagsInput', ['module', 'exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.React);
    global.ReactTagsInput = mod.exports;
  }
})(this, function (module, exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _objectWithoutProperties(obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  }

  function uniq(arr) {
    var out = [];

    for (var i = 0; i < arr.length; i++) {
      if (out.indexOf(arr[i]) === -1) {
        out.push(arr[i]);
      }
    }

    return out;
  }

  /* istanbul ignore next */
  function getClipboardData(e) {
    if (window.clipboardData) {
      return window.clipboardData.getData('Text');
    }

    if (e.clipboardData) {
      return e.clipboardData.getData('text/plain');
    }

    return '';
  }

  function defaultRenderTag(props) {
    var tag = props.tag,
        key = props.key,
        disabled = props.disabled,
        onRemove = props.onRemove,
        classNameRemove = props.classNameRemove,
        getTagDisplayValue = props.getTagDisplayValue,
        other = _objectWithoutProperties(props, ['tag', 'key', 'disabled', 'onRemove', 'classNameRemove', 'getTagDisplayValue']);

    return _react2.default.createElement(
      'span',
      _extends({ key: key }, other),
      getTagDisplayValue(tag),
      !disabled && _react2.default.createElement('a', { className: classNameRemove, onClick: function onClick(e) {
          return onRemove(key);
        } })
    );
  }

  defaultRenderTag.propTypes = {
    key: _react2.default.PropTypes.number,
    tag: _react2.default.PropTypes.string,
    onRemove: _react2.default.PropTypes.func,
    classNameRemove: _react2.default.PropTypes.string,
    getTagDisplayValue: _react2.default.PropTypes.func
  };

  function defaultRenderInput(props) {
    var onChange = props.onChange,
        value = props.value,
        addTag = props.addTag,
        other = _objectWithoutProperties(props, ['onChange', 'value', 'addTag']);

    return _react2.default.createElement('input', _extends({ type: 'text', onChange: onChange, value: value }, other));
  }

  defaultRenderInput.propTypes = {
    value: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func,
    addTag: _react2.default.PropTypes.func
  };

  function defaultRenderLayout(tagComponents, inputComponent) {
    return _react2.default.createElement(
      'span',
      null,
      tagComponents,
      inputComponent
    );
  }

  function defaultPasteSplit(data) {
    return data.split(' ').map(function (d) {
      return d.trim();
    });
  }

  var defaultInputProps = {
    className: 'react-tagsinput-input',
    placeholder: 'Add a tag'
  };

  var TagsInput = function (_React$Component) {
    _inherits(TagsInput, _React$Component);

    function TagsInput() {
      _classCallCheck(this, TagsInput);

      var _this = _possibleConstructorReturn(this, (TagsInput.__proto__ || Object.getPrototypeOf(TagsInput)).call(this));

      _this.state = { tag: '', isFocused: false, inputIsFocused: false, isTagFocused: false };
      _this.focus = _this.focus.bind(_this);
      _this.blur = _this.blur.bind(_this);
      return _this;
    }

    _createClass(TagsInput, [{
      key: '_getTagDisplayValue',
      value: function _getTagDisplayValue(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;


        if (tagDisplayProp) {
          return tag[tagDisplayProp];
        }

        return tag;
      }
    }, {
      key: '_makeTag',
      value: function _makeTag(tag) {
        var tagDisplayProp = this.props.tagDisplayProp;


        if (tagDisplayProp) {
          return _defineProperty({}, tagDisplayProp, tag);
        }

        return tag;
      }
    }, {
      key: '_removeTag',
      value: function _removeTag(index) {
        var value = this.props.value.concat([]);
        if (index > -1 && index < value.length) {
          var changed = value.splice(index, 1);
          this.props.onChange(value, changed, [index]);
        }
      }
    }, {
      key: '_clearInput',
      value: function _clearInput() {
        this.setState({ tag: '' });
      }
    }, {
      key: '_addTags',
      value: function _addTags(tags) {
        var _this2 = this;

        var _props = this.props,
            validationRegex = _props.validationRegex,
            onChange = _props.onChange,
            onlyUnique = _props.onlyUnique,
            maxTags = _props.maxTags,
            value = _props.value;


        if (onlyUnique) {
          tags = uniq(tags);
          tags = tags.filter(function (tag) {
            return value.every(function (currentTag) {
              return _this2._getTagDisplayValue(currentTag) !== _this2._getTagDisplayValue(tag);
            });
          });
        }

        tags = tags.filter(function (tag) {
          return validationRegex.test(_this2._getTagDisplayValue(tag));
        });
        tags = tags.filter(function (tag) {
          var tagDisplayValue = _this2._getTagDisplayValue(tag);
          if (typeof tagDisplayValue.trim === 'function') {
            return tagDisplayValue.trim().length > 0;
          } else {
            return tagDisplayValue;
          }
        });

        if (maxTags >= 0) {
          var remainingLimit = Math.max(maxTags - value.length, 0);
          tags = tags.slice(0, remainingLimit);
        }

        if (tags.length > 0) {
          var newValue = value.concat(tags);
          var indexes = [];
          for (var i = 0; i < tags.length; i++) {
            indexes.push(value.length + i);
          }
          onChange(newValue, tags, indexes);
          this._clearInput();
          return true;
        }

        this._clearInput();
        return false;
      }
    }, {
      key: 'focus',
      value: function focus() {
        if (this.refs.input && typeof this.refs.input.focus === 'function') {
          this.refs.input.focus();
        }

        this.setStateToFocused();
      }
    }, {
      key: 'blur',
      value: function blur() {
        if (this.refs.input && typeof this.refs.input.blur === 'function') {
          this.refs.input.blur();
        }

        this.setStateToNotFocused();
      }
    }, {
      key: 'accept',
      value: function accept() {
        var tag = this.state.tag;


        if (tag !== '') {
          tag = this._makeTag(tag);
          return this._addTags([tag]);
        }

        return false;
      }
    }, {
      key: 'addTag',
      value: function addTag(tag) {
        return this._addTags([tag]);
      }
    }, {
      key: 'clearInput',
      value: function clearInput() {
        this._clearInput();
      }
    }, {
      key: 'handlePaste',
      value: function handlePaste(e) {
        var _this3 = this;

        var _props2 = this.props,
            addOnPaste = _props2.addOnPaste,
            pasteSplit = _props2.pasteSplit;


        if (!addOnPaste) {
          return;
        }

        e.preventDefault();

        var data = getClipboardData(e);
        var tags = pasteSplit(data).map(function (tag) {
          return _this3._makeTag(tag);
        });

        this._addTags(tags);
      }
    }, {
      key: 'handleKeyDown',
      value: function handleKeyDown(e) {
        if (e.defaultPrevented) {
          return;
        }

        var _props3 = this.props,
            value = _props3.value,
            removeKeys = _props3.removeKeys,
            addKeys = _props3.addKeys;
        var tag = this.state.tag;

        var empty = tag === '';
        var keyCode = e.keyCode;
        var add = addKeys.indexOf(keyCode) !== -1;
        var remove = removeKeys.indexOf(keyCode) !== -1;

        if (add) {
          var added = this.accept();
          // Special case for preventing forms submitting.
          if (added || keyCode === 13) {
            e.preventDefault();
          }
        }

        if (remove && value.length > 0 && empty && !this.state.inputIsFocused) {
          e.preventDefault();
          this._removeTag(value.length - 1);
        }
      }
    }, {
      key: 'handleClick',
      value: function handleClick(e) {
        if (e.target === this.refs.div) {
          this.focus();
          this.setState({ inputIsFocused: true });
        }
      }
    }, {
      key: 'handleChange',
      value: function handleChange(e) {
        var onChange = this.props.inputProps.onChange;

        var tag = e.target.value;

        if (onChange) {
          onChange(e);
        }

        this.setState({ tag: tag });
      }
    }, {
      key: 'handleRemove',
      value: function handleRemove(tag) {
        this._removeTag(tag);
      }
    }, {
      key: 'setStateToFocused',
      value: function setStateToFocused() {
        if (!this.state.isFocused) {
          this.setState(function () {
            return {
              isFocused: true
            };
          });
        }
      }
    }, {
      key: 'setStateToNotFocused',
      value: function setStateToNotFocused() {
        if (this.state.isFocused) {
          this.setState(function () {
            return {
              isFocused: false
            };
          });
        }
      }
    }, {
      key: 'setInputStateToFocused',
      value: function setInputStateToFocused() {
        if (!this.state.inputIsFocused) {
          this.setState(function () {
            return {
              inputIsFocused: true
            };
          });
        }
      }
    }, {
      key: 'setInputStateToNotFocused',
      value: function setInputStateToNotFocused() {
        if (this.state.inputIsFocused) {
          this.setState(function () {
            return {
              inputIsFocused: false
            };
          });
        }
      }
    }, {
      key: 'inputProps',
      value: function inputProps() {
        var _props$inputProps = this.props.inputProps,
            onChange = _props$inputProps.onChange,
            onFocus = _props$inputProps.onFocus,
            onBlur = _props$inputProps.onBlur,
            otherInputProps = _objectWithoutProperties(_props$inputProps, ['onChange', 'onFocus', 'onBlur']);

        var props = _extends({}, defaultInputProps, otherInputProps);

        if (this.props.disabled) {
          props.disabled = true;
        }

        return props;
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.setState({
          tag: this.props.currentValue
        });
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!nextProps.currentValue) {
          return;
        }

        this.setState({
          tag: nextProps.currentValue
        });
      }
    }, {
      key: 'render',
      value: function render() {
        var _this4 = this;

        var _props4 = this.props,
            value = _props4.value,
            onChange = _props4.onChange,
            tagProps = _props4.tagProps,
            renderLayout = _props4.renderLayout,
            renderTag = _props4.renderTag,
            renderInput = _props4.renderInput,
            addKeys = _props4.addKeys,
            removeKeys = _props4.removeKeys,
            className = _props4.className,
            focusedClassName = _props4.focusedClassName,
            addOnBlur = _props4.addOnBlur,
            addOnPaste = _props4.addOnPaste,
            inputProps = _props4.inputProps,
            pasteSplit = _props4.pasteSplit,
            onlyUnique = _props4.onlyUnique,
            maxTags = _props4.maxTags,
            validationRegex = _props4.validationRegex,
            disabled = _props4.disabled,
            tagDisplayProp = _props4.tagDisplayProp,
            other = _objectWithoutProperties(_props4, ['value', 'onChange', 'tagProps', 'renderLayout', 'renderTag', 'renderInput', 'addKeys', 'removeKeys', 'className', 'focusedClassName', 'addOnBlur', 'addOnPaste', 'inputProps', 'pasteSplit', 'onlyUnique', 'maxTags', 'validationRegex', 'disabled', 'tagDisplayProp']);

        var _state = this.state,
            tag = _state.tag,
            isFocused = _state.isFocused,
            inputIsFocused = _state.inputIsFocused;


        if (isFocused) {
          className += ' ' + focusedClassName;
        }

        var tagComponents = value.map(function (tag, index) {
          return renderTag(_extends({
            isFocused: isFocused, key: index, tag: tag, onRemove: _this4.handleRemove.bind(_this4), disabled: disabled, setStateToFocused: _this4.setStateToFocused.bind(_this4), setStateToNotFocused: _this4.setStateToNotFocused.bind(_this4), setInputStateToFocused: _this4.setInputStateToFocused.bind(_this4), getTagDisplayValue: _this4._getTagDisplayValue.bind(_this4) }, tagProps));
        });

        var inputComponent = renderInput(_extends({
          ref: 'input',
          value: tag,
          isFocused: isFocused,
          setStateToFocused: this.setStateToFocused.bind(this),
          setStateToNotFocused: this.setStateToNotFocused.bind(this),
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onChange: this.handleChange.bind(this),
          addTag: this.addTag.bind(this),
          inputIsFocused: inputIsFocused,
          setInputStateToNotFocused: this.setInputStateToNotFocused.bind(this)
        }, this.inputProps()));

        return _react2.default.createElement(
          'div',
          { ref: 'div', onClick: this.handleClick.bind(this), className: className },
          renderLayout(tagComponents, inputComponent)
        );
      }
    }]);

    return TagsInput;
  }(_react2.default.Component);

  TagsInput.propTypes = {
    focusedClassName: _react2.default.PropTypes.string,
    addKeys: _react2.default.PropTypes.array,
    addOnBlur: _react2.default.PropTypes.bool,
    addOnPaste: _react2.default.PropTypes.bool,
    currentValue: _react2.default.PropTypes.string,
    inputProps: _react2.default.PropTypes.object,
    onChange: _react2.default.PropTypes.func.isRequired,
    removeKeys: _react2.default.PropTypes.array,
    renderInput: _react2.default.PropTypes.func,
    renderTag: _react2.default.PropTypes.func,
    renderLayout: _react2.default.PropTypes.func,
    pasteSplit: _react2.default.PropTypes.func,
    tagProps: _react2.default.PropTypes.object,
    onlyUnique: _react2.default.PropTypes.bool,
    value: _react2.default.PropTypes.array.isRequired,
    maxTags: _react2.default.PropTypes.number,
    validationRegex: _react2.default.PropTypes.instanceOf(RegExp),
    disabled: _react2.default.PropTypes.bool,
    tagDisplayProp: _react2.default.PropTypes.string
  };
  TagsInput.defaultProps = {
    className: 'react-tagsinput',
    focusedClassName: 'react-tagsinput--focused',
    currentValue: '',
    addKeys: [9, 13],
    addOnBlur: false,
    addOnPaste: false,
    inputProps: {},
    removeKeys: [8],
    renderInput: defaultRenderInput,
    renderTag: defaultRenderTag,
    renderLayout: defaultRenderLayout,
    pasteSplit: defaultPasteSplit,
    tagProps: { className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove' },
    onlyUnique: false,
    maxTags: -1,
    validationRegex: /.*/,
    disabled: false,
    tagDisplayProp: null
  };
  exports.default = TagsInput;
  module.exports = exports['default'];
});

