import React from 'react'

function uniq (arr) {
  let out = []

  for (let i = 0; i < arr.length; i++) {
    if (out.indexOf(arr[i]) === -1) {
      out.push(arr[i])
    }
  }

  return out
}

/* istanbul ignore next */
function getClipboardData (e) {
  if (window.clipboardData) {
    return window.clipboardData.getData('Text')
  }

  if (e.clipboardData) {
    return e.clipboardData.getData('text/plain')
  }

  return ''
}

function defaultRenderTag (props) {
  let {tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue, ...other} = props
  return (
    <span key={key} {...other}>
      {getTagDisplayValue(tag)}
      {!disabled &&
        <a className={classNameRemove} onClick={(e) => onRemove(key)} />
      }
    </span>
  )
}

defaultRenderTag.propTypes = {
  key: React.PropTypes.number,
  tag: React.PropTypes.string,
  onRemove: React.PropTypes.func,
  classNameRemove: React.PropTypes.string,
  getTagDisplayValue: React.PropTypes.func
}

function defaultRenderInput (props) {
  // eslint-disable-next-line
  let {onChange, value, addTag, ...other} = props
  return (
    <input type='text' onChange={onChange} value={value} {...other} />
  )
}

defaultRenderInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  addTag: React.PropTypes.func
}

function defaultRenderLayout (tagComponents, inputComponent) {
  return (
    <span>
      {tagComponents}
      {inputComponent}
    </span>
  )
}

function defaultPasteSplit (data) {
  return data.split(' ').map(d => d.trim())
}

const defaultInputProps = {
  className: 'react-tagsinput-input',
  placeholder: 'Add a tag'
}

class TagsInput extends React.Component {
  constructor () {
    super()
    this.state = {tag: '', isFocused: false, inputIsFocused: false, isTagFocused: false}
    this.focus = ::this.focus
    this.blur = ::this.blur
  }

  static propTypes = {
    focusedClassName: React.PropTypes.string,
    addKeys: React.PropTypes.array,
    addOnBlur: React.PropTypes.bool,
    addOnPaste: React.PropTypes.bool,
    currentValue: React.PropTypes.string,
    inputProps: React.PropTypes.object,
    onChange: React.PropTypes.func.isRequired,
    removeKeys: React.PropTypes.array,
    renderInput: React.PropTypes.func,
    renderTag: React.PropTypes.func,
    renderLayout: React.PropTypes.func,
    pasteSplit: React.PropTypes.func,
    tagProps: React.PropTypes.object,
    onlyUnique: React.PropTypes.bool,
    value: React.PropTypes.array.isRequired,
    maxTags: React.PropTypes.number,
    validationRegex: React.PropTypes.instanceOf(RegExp),
    disabled: React.PropTypes.bool,
    tagDisplayProp: React.PropTypes.string
  }

  static defaultProps = {
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
    tagProps: {className: 'react-tagsinput-tag', classNameRemove: 'react-tagsinput-remove'},
    onlyUnique: false,
    maxTags: -1,
    validationRegex: /.*/,
    disabled: false,
    tagDisplayProp: null
  }

  _getTagDisplayValue (tag) {
    const {tagDisplayProp} = this.props

    if (tagDisplayProp) {
      return tag[tagDisplayProp]
    }

    return tag
  }

  _makeTag (tag) {
    const {tagDisplayProp} = this.props

    if (tagDisplayProp) {
      return {
        [tagDisplayProp]: tag
      }
    }

    return tag
  }

  _removeTag (index) {
    let value = this.props.value.concat([])
    if (index > -1 && index < value.length) {
      let changed = value.splice(index, 1)
      this.props.onChange(value, changed, [index])
    }
  }

  _clearInput () {
    this.setState({tag: ''})
  }

  _addTags (tags) {
    let {validationRegex, onChange, onlyUnique, maxTags, value} = this.props

    if (onlyUnique) {
      tags = uniq(tags)
      tags = tags.filter(tag => value.every(currentTag => this._getTagDisplayValue(currentTag) !== this._getTagDisplayValue(tag)))
    }

    tags = tags.filter(tag => validationRegex.test(this._getTagDisplayValue(tag)))
    tags = tags.filter(tag => {
      let tagDisplayValue = this._getTagDisplayValue(tag)
      if (typeof tagDisplayValue.trim === 'function') {
        return tagDisplayValue.trim().length > 0
      } else {
        return tagDisplayValue
      }
    })

    if (maxTags >= 0) {
      let remainingLimit = Math.max(maxTags - value.length, 0)
      tags = tags.slice(0, remainingLimit)
    }

    if (tags.length > 0) {
      let newValue = value.concat(tags)
      let indexes = []
      for (let i = 0; i < tags.length; i++) {
        indexes.push(value.length + i)
      }
      onChange(newValue, tags, indexes)
      this._clearInput()
      return true
    }

    this._clearInput()
    return false
  }

  focus () {
    if (this.refs.input && typeof this.refs.input.focus === 'function') {
      this.refs.input.focus()
    }

    this.setStateToFocused();
  }

  blur () {
    if (this.refs.input && typeof this.refs.input.blur === 'function') {
      this.refs.input.blur()
    }

    this.setStateToNotFocused();
  }

  accept () {
    let {tag} = this.state

    if (tag !== '') {
      tag = this._makeTag(tag)
      return this._addTags([tag])
    }

    return false
  }

  addTag (tag) {
    return this._addTags([tag])
  }

  clearInput () {
    this._clearInput()
  }

  handlePaste (e) {
    let {addOnPaste, pasteSplit} = this.props

    if (!addOnPaste) {
      return
    }

    e.preventDefault()

    let data = getClipboardData(e)
    let tags = pasteSplit(data).map(tag => this._makeTag(tag))

    this._addTags(tags)
  }

  handleKeyDown (e) {
    if (e.defaultPrevented) {
      return
    }

    let {value, removeKeys, addKeys} = this.props
    let {tag} = this.state
    let empty = tag === ''
    let keyCode = e.keyCode
    let add = addKeys.indexOf(keyCode) !== -1
    let remove = removeKeys.indexOf(keyCode) !== -1

    if (add) {
      let added = this.accept()
      // Special case for preventing forms submitting.
      if (added || keyCode === 13) {
        e.preventDefault()
      }
    }

    if (remove && value.length > 0 && empty && !this.state.inputIsFocused) {
      e.preventDefault()
      this._removeTag(value.length - 1)
    }
  }

  handleClick (e) {
    if (e.target === this.refs.div) {
      this.focus()
      this.setState({inputIsFocused: true})
    }
  }

  handleChange (e) {
    let {onChange} = this.props.inputProps
    let tag = e.target.value

    if (onChange) {
      onChange(e)
    }

    this.setState({tag})
  }

  handleRemove (tag) {
    this._removeTag(tag)
  }

  setStateToFocused() {
  	if (!this.state.isFocused) {
	  	this.setState(() => {
	  		return {
	  			isFocused: true
	  		}
	  	});
	}
  }

  setStateToNotFocused() {
  	if (this.state.isFocused) {
	  	this.setState(() => {
	  		return {
	  			isFocused: false
	  		}
	  	});
	}
  }

  setInputStateToFocused() {
  	if (!this.state.inputIsFocused) {
	  	this.setState(() => {
	  		return {
	  			inputIsFocused: true
	  		}
	  	});
	}
  }

  setInputStateToNotFocused() {
  	if (this.state.inputIsFocused) {
	  	this.setState(() => {
	  		return {
	  			inputIsFocused: false
	  		}
	  	});
	}
  }

  inputProps () {
    // eslint-disable-next-line
    let {onChange, onFocus, onBlur, ...otherInputProps} = this.props.inputProps

    let props = {
      ...defaultInputProps,
      ...otherInputProps
    }

    if (this.props.disabled) {
      props.disabled = true
    }

    return props
  }

  componentDidMount () {
    this.setState({
      tag: this.props.currentValue
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.currentValue) {
      return
    }

    this.setState({
      tag: nextProps.currentValue
    })
  }

  render () {
    // eslint-disable-next-line
    let {value, onChange, tagProps, renderLayout, renderTag, renderInput, addKeys, removeKeys, className, focusedClassName, addOnBlur, addOnPaste, inputProps, pasteSplit, onlyUnique, maxTags, validationRegex, disabled, tagDisplayProp, ...other} = this.props
    let {tag, isFocused, inputIsFocused} = this.state

    if (isFocused) {	
      className += ' ' + focusedClassName
    }

    let tagComponents = value.map((tag, index) => {
      return renderTag({
        isFocused: isFocused, key: index, tag, onRemove: ::this.handleRemove, disabled, setStateToFocused: ::this.setStateToFocused, setStateToNotFocused: ::this.setStateToNotFocused, setInputStateToFocused: ::this.setInputStateToFocused, getTagDisplayValue: ::this._getTagDisplayValue, ...tagProps
      })
    })

    let inputComponent = renderInput({
      ref: 'input',
      value: tag,
      isFocused: isFocused,
      setStateToFocused: ::this.setStateToFocused,
      setStateToNotFocused: ::this.setStateToNotFocused,
      onPaste: ::this.handlePaste,
      onKeyDown: ::this.handleKeyDown,
      onChange: ::this.handleChange,
      addTag: ::this.addTag,
      inputIsFocused: inputIsFocused,
      setInputStateToNotFocused: ::this.setInputStateToNotFocused,
      ...this.inputProps()
    })

    return (
      <div ref='div' onClick={::this.handleClick} className={className}>
        {renderLayout(tagComponents, inputComponent)}
      </div>
    )
  }
}

export default TagsInput
