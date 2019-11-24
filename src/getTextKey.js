export default key => {
	var [prefix, postfix] = Array.isArray(key) ? key : []
	if(
		(typeof key != 'string' || !key)
		&& !prefix
	){
		throw new TypeError('INVALID_TEXT_KEY')
	}
	return {
		key: prefix ?
			(prefix.toLowerCase() + (postfix||'').toLowerCase())
			: key.toLowerCase().replace(/ /g, '_'),
		prefix,
		postfix
	}
}