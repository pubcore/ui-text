import post from 'pubcore-http'

var missingTextkeys = {},
	missingTextkeyData = {},
	missingTextkeyTimer,
	config = {
		postUri: '',
		timeout: 3000
	},
	requestCount = 0

var postStatus = () => post(config.postUri, missingTextkeyData).then(
	() => {
		missingTextkeyData = {}
		missingTextkeys = {}
	}
)

const startPostMissingTextkeyTimer = () => {
	if (missingTextkeyTimer) {
		clearTimeout(missingTextkeyTimer)
	}
	missingTextkeyTimer = setTimeout(postStatus, config.timeout)
}

export const isMissingTextkey = key => {
	return missingTextkeys[key] || false
}

export const initLogMissingTextkey = c => {
	config = {...config, ...c}
}

export default (key, replacement, defaultText) => {
	if (!missingTextkeys[key]) {
		missingTextkeys[key] = true
		missingTextkeyData[key] = (defaultText || key) + (replacement
			? ' ' + JSON.stringify(replacement)
			: '')

		if (config.postUri && requestCount < 1) {
			requestCount++
			if (config.timeout === 0) {
				postStatus()
			} else if (config.timeout > 0) {
				startPostMissingTextkeyTimer()
			}
		}
	}
}
