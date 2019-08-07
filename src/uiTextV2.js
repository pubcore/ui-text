import validateTextkey from './validateTextkey'
import replace from './replace'

export default (T, key, arg3, arg4, isDev) => {
	var defaultText = typeof arg3 === 'string' ? arg3 : undefined,
		replacement = typeof arg3 === 'object' ? arg3 : arg4,
		v = validateTextkey({T,key,defaultText,isDev})
	return replace({text:v.text,defaultText:v.defaultText,replacement,key:v.key})
}
