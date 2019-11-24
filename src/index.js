import replace from './replace'
import manageText from './manageText'
import getText from './getText'
import registerDefaultText from './registerDefaultText'

export {registerDefaultText}

export default (T, key, arg3, arg4, config={
	envType:'production',
	defaultTexts: {},
	registerDefaultText: undefined
}) => {
	var defaultText = typeof arg3 === 'string' ? arg3 : undefined,
		replacements = typeof arg3 === 'object' ? arg3 : arg4,
		{defaultTexts, envType} = config

	if(envType==='development') {
		manageText(T, key, defaultText, config)
	}

	return replace({
		...getText(T, key, defaultText, defaultTexts),
		replacements
	})
}