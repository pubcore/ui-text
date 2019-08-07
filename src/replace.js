import logMissingText from './logMissingTextkey'

export default function ({text, defaultText, replacement, key}) {
	var result = typeof text === 'undefined'
		? logMissingText(key, replacement, defaultText) || defaultText || key
		: text

	if (result && replacement) {
		var noDataForReplacement = []
		// search and replace replacement-tags in result text
		result = result.replace(/\{(\w+)\}/g, (m, tag) =>
			tag in replacement
				? replacement[tag]
				: noDataForReplacement.push(tag) && m
		)

		if (noDataForReplacement.length) {
			/*eslint-disable no-console*/
			console.warn(
				'No data for replacement(s): ' + noDataForReplacement.join(', ')
			)
			/*eslint-enalbe no-console*/
		}
	}

	return '' + result
}
