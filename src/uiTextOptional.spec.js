import {expect} from 'chai'
import {uiTextOptional} from './uiText'
import {isMissingTextkey} from './logMissingTextkey'

describe('uiTextOptional ' + new Date(), () => {
	it('is available', () => {
		expect(uiTextOptional).to.not.be.null
	})
	it('never return key, if not exits in text-object', () => {
		expect(uiTextOptional({}, 'K')).to.equal('')
	})
	it('return text with replaced placeholder, if data is given', () => {
		expect(uiTextOptional({K: 'some text with replacement {count}'}, 'K', {count: 123})).to.equal('some text with replacement 123')
	})
	it('return default-text with replaced placeholder, if given', () => {
		expect(uiTextOptional({}, 'K', 'some text with replacement {count}', {count: 123})).to.equal('some text with replacement 123')
	})
	it('does not return default-text, if textdata and default-text is given', () => {
		expect(uiTextOptional({K: 'some text {count}'}, 'K', 'some default text', {count: 123})).to.equal('some text 123')
	})
	it('does not log if text is undefined for given key', () => {
		expect(isMissingTextkey('K')).to.be.false
	})
})
