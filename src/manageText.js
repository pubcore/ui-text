import get from 'lodash.get'
import getTextKey from './getTextKey'

export default (T, k, defaultText, config) => {
	var {key, prefix} = getTextKey(k),
		{defaultTexts, registerDefaultText} = config

	if(registerDefaultText && defaultText
		&& get(defaultTexts, key) != defaultText
	){
		defaultTexts = registerDefaultText({
			key, defaultText, isOptional:prefix ? true : false, config
		})
	}
	var registeredText = get(defaultTexts, prefix || key)
	if (defaultText === undefined && !registeredText){
		throw new TypeError('NO_DEFAULT_TEXT')
	}
}