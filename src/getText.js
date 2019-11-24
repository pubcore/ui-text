import getTextKey from './getTextKey'
import getDefaultText from './getDefaultText'

export default (T, k, defaultText, defaultTexts) => {
	var {key} = getTextKey(k), text = ''
	if(T[key] === undefined){
		text = getDefaultText(k, defaultText, defaultTexts)
	}else{
		text = T[key]
	}

	return {text, key}
}