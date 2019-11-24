import getTextKey from './getTextKey'
const ucFirst = s => s.charAt(0).toUpperCase() + s.slice(1)

export default (k, defaultText, defaultTexts) => {
	var {key, prefix} = getTextKey(k), text
	if(defaultText === undefined){
		text = prefix ? defaultTexts[prefix] || '' : defaultTexts[key]
	}else{
		text = defaultText
	}
	return text === undefined ? ucFirst(key.replace(/_/, ' ')) : text
}