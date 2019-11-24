export default ({text, replacements, key}) => {
	var noDataForReplacement = [], replaced = text
	if(replacements){
		// search and replace replacement-tags in text text
		replaced = text.replace(
			/\{(\w+)\}/g,
			(m, tag) => tag in replacements ?
				replacements[tag]
				: noDataForReplacement.push(tag) && m
		)
		if (noDataForReplacement.length) {
			/*eslint-disable no-console*/
			console.warn(`No data is given for replacement-tag(s) "${noDataForReplacement.join('", "')}" of textkey "${key}"`)
			/*eslint-enalbe no-console*/
		}
	}
	return '' + replaced
}
