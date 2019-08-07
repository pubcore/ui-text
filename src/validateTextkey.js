import autoupdateDefaultTexts, {isAutoupdateDefaultTextsEnabled} from './autoupdateDefaultTexts'

var config = {
	autoupdateUri: '',
	defaultTexts: undefined
}

export const initDefaultTexts = (defaultTexts) => config.defaultTexts = defaultTexts
export const isDefaultTextModeEnabled = () => typeof config.defaultTexts == 'object'

export default ({T,key,defaultText,isDev}) => {
	var prefix = '',
		postfix = '',
		dynamic = false,
		tmpDynamic = false,
		optional = false,
		tmpDefaultText = defaultText

	isDev = isDev === true ? true : false

	if (typeof key == 'string') {
		prefix = key
	} else if (Array.isArray(key) && key.length > 0) {
		prefix = key[0]
		postfix = key[1] ? key[1] : ''
		tmpDynamic = true
	} else {
		throw 'ERROR_KEY_INVALID'
	}
	key = prefix+postfix
	var text = T[key]

	if (config.defaultTexts && config.defaultTexts[prefix] && typeof config.defaultTexts[prefix].text == 'string') {
		defaultText = config.defaultTexts[prefix].text
		optional 		= config.defaultTexts[prefix].optional 	=== true ? true : false
		dynamic 		= config.defaultTexts[prefix].dynamic 	=== true ? true : false
	} else if (typeof tmpDefaultText == 'string') {
		tmpDynamic = dynamic
		config.defaultTexts[prefix] = {
			text: tmpDefaultText,
			optional,
			dynamic
		}
		isDev && isAutoupdateDefaultTextsEnabled() && autoupdateDefaultTexts(prefix,config.defaultTexts[prefix])
	}


	if (isDev) {
		if (dynamic != tmpDynamic) 	throw 'ERROR_WRONG_KEY_USE_OR_DYNAMIC_KEY_DECLARATION ['+prefix+']'
		if (typeof defaultText == 'undefined') throw 'ERROR_NO_DEFAULT_DEFINED ['+prefix+']'
		if (typeof tmpDefaultText == 'string' && defaultText != tmpDefaultText) 	throw 'ERROR_DEFAULT_TEXT_CONFLICT ['+prefix+']'
	}

	( (dynamic != tmpDynamic)
		|| typeof defaultText == 'undefined'
		|| optional
	) && (defaultText = '')

	if (optional) {
		text = text === undefined
			? (typeof tmpDefaultText === 'string' ? tmpDefaultText : '')
			: text
	}

	return {text,key,defaultText}
}
