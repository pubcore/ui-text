import {expect} from 'chai'
import {initAutoupdateDefaultTexts,isAutoupdateDefaultTextsEnabled} from './autoupdateDefaultTexts'

describe('autoupdateDefaultTexts, ' + new Date(), () => {

	beforeEach(() => {
		initAutoupdateDefaultTexts({postUri: ''})
	})

	it('isAutoupdateDefaultTextsEnabled() should return false', () => {
		expect(isAutoupdateDefaultTextsEnabled()).to.be.false
	})
	it('isAutoupdateDefaultTextsEnabled() should return true', () => {
		initAutoupdateDefaultTexts({
			postUri: 'someuri',
			timeout: 3000
		})
		expect(isAutoupdateDefaultTextsEnabled()).to.be.true
		initAutoupdateDefaultTexts({postUri: ''})
	})
})
