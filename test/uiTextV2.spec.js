import {expect} from 'chai'
import defaultTexts from './defaultTexts.json'
import {initDefaultTexts} from '../src/validateTextkey'
import uiTextV2 from '../src/uiTextV2'

describe('uiTextV2, ' + new Date(), () => {

	beforeEach(() => {
		initDefaultTexts(defaultTexts)
	})

	it('get existing default text', () => {
		expect(
			uiTextV2({}, 'required_textkey1_static', 'required textkey1 static {replacement}', {replacement:'replacement'}, true)
		).to.be.equal('required textkey1 static replacement')
	})
})
