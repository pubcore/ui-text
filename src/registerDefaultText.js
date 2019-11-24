import request from '@pubcore/http-client'

var	newDefaultText = {},
	timer

export const postDefaultTexts = ({newDefaultText, uri, config}) => request({
	uri, method:'post', data: newDefaultText
}).then(
	() => ({...config.defaultTexts, ...newDefaultText}),
	err => Promise.reject(err)
)

export default ({uri}) => ({key, text, isOptional, config}) => {
	newDefaultText[key] = text
	if(timer) clearTimeout(timer)
	timer = setTimeout(
		() => postDefaultTexts({newDefaultText, isOptional, uri, config}).then(
			defaultTexts => console.log(`#${Object.keys(defaultTexts).length} default texts saved`),
			err => {
				console.error(err)
				newDefaultText = {}
			}
		),
		config.registerDefaultTextTimeout || 500
	)
	return {...config.defaultTexts, ...newDefaultText}
}
