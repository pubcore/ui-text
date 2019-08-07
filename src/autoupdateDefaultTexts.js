import post from 'pubcore-http'

var	newDefaultText = {},
	config = {
		postUri: '',
		timeout: 3000
	}

var postDefaultTexts = () => post(config.postUri, newDefaultText).then(
	() => newDefaultText = {}
)

export const initAutoupdateDefaultTexts = c => {
	config = {...config, ...c}
}

export const isAutoupdateDefaultTextsEnabled = () => typeof config.postUri==='string' && config.postUri.length > 0

export default (prefix,spec) => {
	newDefaultText[prefix] = spec
	postDefaultTexts()
}
