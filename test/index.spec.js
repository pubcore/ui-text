import {expect} from 'chai'
import uiText, {registerDefaultText} from '../src/index'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
var mockHttp = new MockAdapter(axios)
mockHttp.onPost('/register').reply(200)

describe('uiText', () => {
	it('throws errors, if key is invalid', () => {
		expect(() => uiText({})).to.throw('INVALID_TEXT_KEY')
		expect(() => uiText(null)).to.throw('INVALID_TEXT_KEY')
		expect(() => uiText({})).to.throw('INVALID_TEXT_KEY')
		expect(() => uiText(1)).to.throw('INVALID_TEXT_KEY')
		expect(() => uiText(true)).to.throw('INVALID_TEXT_KEY')
		expect(() => uiText(()=>0)).to.throw('INVALID_TEXT_KEY')
	})
	it('returns text of type string', () => {
		expect(uiText({k: ''}, 'k')).to.equal('')
		expect(uiText({k: 1}, 'k')).to.equal('1')
		expect(uiText({k: 0}, 'k')).to.equal('0')
		expect(uiText({k: null}, 'k')).to.equal('null')
	})
	it('returns textkey (without underscores) as fallback', () => {
		expect(uiText({}, 'no_key')).to.equal('No key')
	})
	it('transforms to snake case', () => {
		expect(uiText({}, 'No key')).to.equal('No key')
	})
	it('transforms to snake case key, and returns defined text if exists', () => {
		expect(uiText({some_key:'foo'}, 'some key')).to.equal('foo')
	})
	it('returns text with replaced replacements', () => {
		expect(uiText({k: 'replacement {count}.'}, 'k', {count: 5})).to.equal('replacement 5.')
	})
	it('generates warnings if replacements not defined', () => {
		expect(uiText({k: 'Book {count}'}, 'k', {})).to.equal('Book {count}')
	})
	it('must return given default text, if text is undefined', () => {
		expect(uiText({}, 'k', 'a default text')).to.equal('a default text')
	})
	it('must return given default text with replaced replacement', () => {
		expect(uiText({}, 'k', 'replacement {count}.', {count: 123})).to.match(/123/)
	})
	it('must return text with replaced replacements, in spite of given default text', () => {
		expect(uiText({k: 'replacement {count}.'}, 'k', 'a default text {count}', {count: 5})).to.equal('replacement 5.')
	})

	describe('optional textkey behaviour', () => {
		it('never return key, if not exits in text-object', () => {
			expect(uiText({}, ['K'])).to.equal('')
		})
		it('return text with replaced placeholder, if data is given', () => {
			expect(uiText({k: 'some text with replacement {count}'}, ['K'], {count: 123})).to.equal('some text with replacement 123')
		})
		it('return default-text with replaced placeholder, if given', () => {
			expect(uiText({}, ['K'], 'some text with replacement {count}', {count: 123})).to.equal('some text with replacement 123')
		})
		it('does not return default-text, if textdata and default-text is given', () => {
			expect(uiText({k: 'some text {count}'}, ['K'], 'some default text', {count: 123})).to.equal('some text 123')
		})
	})

	describe('development mode behaviour', () => {
		const T = (t, key, arg3, arg4) => uiText(t, key, arg3, arg4, {
			envType:'development',
			defaultTexts:{key:'foo'},
			registerDefaultText: registerDefaultText({uri:'/register'})
		})
		it('throws an error, if no default text is given', () => {
			expect(() => {T({}, 'new_key')}).to.throw(TypeError, 'NO_DEFAULT_TEXT')
		})
		it('registers default text', () => {
			expect(T({}, 'new_key', 'default text')).to.equal('default text')
		})
		it('registers optional default text', () => {
			expect(T({}, ['new_key'], 'default text')).to.equal('default text')
		})
		it('does work without registerDefaultText callback', () => {
			expect(uiText({}, 'foo', 'bar', undefined, {envType:'development'})).to.equal('bar')
		})
	})
})
