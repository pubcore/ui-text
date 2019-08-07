import {expect} from 'chai'
import FakeXMLHTTPRequests from 'fakexmlhttprequest'
import uiText, {initLogMissingTextkey,initDefaultTexts,initEnvIsDev} from './uiText'
import {isMissingTextkey} from './logMissingTextkey'
import defaultTexts from './test/defaultTexts.json'

const T = {
	foo: 'bar'
}

var requests = []
global.XMLHttpRequest = function () {
	var r = new FakeXMLHTTPRequests(arguments)
	requests.push(r)
	return r
}

describe('uiText, ' + new Date(), () => {
	beforeEach(() => {
		requests = [],
		initDefaultTexts()
	})

	it('logs text-keys which did not exist', () => {
		uiText(T, 'thisKeyDoesNotExist')
		expect(isMissingTextkey('thisKeyDoesNotExist')).to.be.true
	})
	it('returns text of type string', () => {
		expect(uiText({k: ''}, 'k')).to.equal('')
		expect(uiText({k: 1}, 'k')).to.equal('1')
		expect(uiText({k: 0}, 'k')).to.equal('0')
		expect(uiText({k: null}, 'k')).to.equal('null')
	})
	it('returns text with replaced replacements', () => {
		expect(uiText({k: 'Text with replacement {count}.'}, 'k', {count: 5})).to.equal('Text with replacement 5.')
	})
	it('must return given default text, if text is undefined', () => {
		expect(uiText({}, 'k', 'a default text')).to.equal('a default text')
	})
	it('must return given default text with replaced replacement', () => {
		expect(uiText({}, 'k', 'a default text with replacement {count}.', {count: 123})).to.match(/123/)
	})
	it('must return text with replaced replacements, in spite of given default text', () => {
		expect(uiText({k: 'a text with replacement {count}.'}, 'k', 'a default text {count}', {count: 5})).to.equal('a text with replacement 5.')
	})

	it('http post missing textkey data, if corresponding uri is given', () => {
		initLogMissingTextkey({postUri: 'https://xyz.com/', timeout: 0})
		uiText({}, 'aKey', 'a default text {count}', {count: 5})
		expect(requests.length).to.equal(1)
		expect(JSON.parse(requests[0].requestBody).aKey).to.equal('a default text {count} {"count":5}')
	})

	it('use component default text config mode, if default text data is set', () => {
		initDefaultTexts(defaultTexts)
		initEnvIsDev(true)
		expect(uiText({'required_textkey1_static':'is configured {replacement}'},'required_textkey1_static',{replacement:'replacement'})).to.be.equal('is configured replacement')
		expect(uiText({},'required_textkey1_static',{replacement:'replacement'})).to.be.equal('required textkey1 static replacement')
		expect(uiText({},'required_textkey1_static','required textkey1 static {replacement}',{replacement:'replacement'})).to.be.equal('required textkey1 static replacement')
		expect(() => uiText({},{0:'required_textkey1_static'},{replacement:'replacement'})).to.throw('ERROR_KEY_INVALID')
		expect(() => uiText({},'required_textkey1_static','diffrent code default',{replacement:'replacement'})).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [required_textkey1_static]')
		expect(() => uiText({},['required_textkey1_static',''],{replacement:'replacement'})).to.throw('ERROR_WRONG_KEY_USE_OR_DYNAMIC_KEY_DECLARATION [required_textkey1_static]')
		expect(() => uiText({},'no_default_text_key')).to.throw('ERROR_NO_DEFAULT_DEFINED')
		expect(uiText({},['required_textkey2_dynamic_prefix','_postfix'],{postfix:'postfix'})).to.be.equal('required textkey2 dynamic postfix')
		expect(uiText({},'no_default_text_key','some default {replacement}',{replacement:'replacement'})).to.be.equal('some default replacement')
		expect(() => uiText({},'required_textkey1_static','different default {replacement}',{replacement:'replacement'})).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [required_textkey1_static]')
	})

	it('test optional texts, use component default text config mode, if default text data is set', () => {
		initDefaultTexts(defaultTexts)
		initEnvIsDev(true)
		expect(uiText({'optional_textkey1_prefix':'is configured {replacement}'},'optional_textkey1_prefix',{replacement:'replacement'})).to.be.equal('is configured replacement')
		expect(uiText({},'optional_textkey1_prefix',{replacement:'replacement'})).to.be.equal('')
		expect(uiText({}, 'optional_textkey1_prefix', 'optional textkey1 {postfix}', {postfix: 'postfix'})).to.equal('optional textkey1 postfix')
		expect(uiText(
			{optional_textkey2_dynamicdefault_prefix_postfix:'optional textkey2 dynamic {replacement}'},
			['optional_textkey2_dynamicdefault_prefix','_postfix'],
			{replacement:'postfix'}
		)).to.be.equal('optional textkey2 dynamic postfix')
		expect(
			() => uiText(
				{optional_textkey2_dynamicdefault_prefix_postfix:'optional textkey2 dynamic {replacement}'},
				['optional_textkey2_dynamicdefault_prefix','_postfix'],
				'wrong default',
				{replacement:'postfix'}
			)).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [optional_textkey2_dynamicdefault_prefix]')
		expect(uiText(
			{},
			['optional_textkey2_dynamicdefault_prefix','_postfix'],
			{replacement:'postfix'}
		)).to.be.equal('')
	})
})
