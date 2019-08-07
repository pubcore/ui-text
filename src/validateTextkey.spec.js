import {expect} from 'chai'
import defaultTexts from './test/defaultTexts.json'
import validateTextkey, {initDefaultTexts,isDefaultTextModeEnabled} from './validateTextkey'
import {initAutoupdateDefaultTexts} from './autoupdateDefaultTexts'

describe('validateTextkey, ' + new Date(), () => {

	beforeEach(() => {
		initDefaultTexts(defaultTexts)
	})

	it('isDefaultTextModeEnabled() should return false', () => {
		initDefaultTexts()
		expect(isDefaultTextModeEnabled()).to.be.false
	})

	it('isDefaultTextModeEnabled() should return true', () => {
		expect(isDefaultTextModeEnabled()).to.be.true
	})

	it('validateTextkey(key not a string) throws ERROR_KEY_INVALID', () => {
		expect(
			() => validateTextkey({})
		).to.throw('ERROR_KEY_INVALID')
		expect(
			() => validateTextkey({key:null})
		).to.throw('ERROR_KEY_INVALID')
		expect(
			() => validateTextkey({key:{}})
		).to.throw('ERROR_KEY_INVALID')
		expect(
			() => validateTextkey({key:1})
		).to.throw('ERROR_KEY_INVALID')
		expect(
			() => validateTextkey({key:true})
		).to.throw('ERROR_KEY_INVALID')
		expect(
			() => validateTextkey({key:()=>0})
		).to.throw('ERROR_KEY_INVALID')
	})
	it('validateTextkey(unknow key, no defaultText) on dev should throw ERROR_NO_DEFAULT_DEFINED', () => {
		expect(
			() => validateTextkey({T:{},key:'unknown',isDev:true})
		).to.throw('ERROR_NO_DEFAULT_DEFINED [unknown]')
	})
	it('validateTextkey(dynamic existing required key, no defaultText) on dev should throw ERROR_WRONG_KEY_USE_OR_DYNAMIC_KEY_DECLARATION', () => {
		expect(
			() => validateTextkey({T:{},key:['required_textkey1_static','_longer'], isDev:true})
		).to.throw('ERROR_WRONG_KEY_USE_OR_DYNAMIC_KEY_DECLARATION [required_textkey1_static]')
	})
	it('validateTextkey(unknown key, no defaultText) not on dev should contain empty string as defaultText', () => {
		expect(
			validateTextkey({T:{},key:'unknown',isDev:false})
		).to.deep.equal({text:undefined,key:'unknown',defaultText:''})
	})
	it('validateTextkey(dynamic existing required key, no defaultText) dynamic conflict not on dev should contain empty string as defaultText', () => {
		expect(
			validateTextkey({T:{},key:['required_textkey1_static','_longer']})
		).to.deep.equal({text:undefined,key:'required_textkey1_static_longer',defaultText:''})
	})
	it('validateTextkey(defaultText is different then configured) on dev throws ERROR_DEFAULT_TEXT_CONFLICT', () => {
		expect(
			() => validateTextkey({T:{},text:'required textkey1 static longer {replacement}',key:'required_textkey1_static_longer',defaultText:'different text',isDev:true})
		).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [required_textkey1_static_longer]')
	})
	it('validateTextkey(defaultText is different then configured) not on dev should contain defaultText from defaultTexts config', () => {
		expect(
			validateTextkey({T:{},text:'required textkey1 static longer {replacement}',key:'required_textkey1_static_longer',defaultText:'different text'})
		).to.deep.equal({text:undefined,key:'required_textkey1_static_longer',defaultText:'required textkey1 static longer {replacement}'})
	})
	it('validateTextkey(optional textkey) should contain an empty string as defaultText', () => {
		expect(
			validateTextkey({T:{},key:'optional_textkey1_prefix',defaultText:'optional textkey1 {postfix}',isDev:true})
		).to.deep.equal({text:'optional textkey1 {postfix}',key:'optional_textkey1_prefix',defaultText:''})
	})
	it('validateTextkey(optional textkey) should contain an empty string as defaultText', () => {
		expect(
			validateTextkey({T:{'optional_textkey1_prefix':'optional text'},key:'optional_textkey1_prefix',defaultText:'optional textkey1 {postfix}',isDev:true})
		).to.deep.equal({text:'optional text',key:'optional_textkey1_prefix',defaultText:''})
	})
	it('validateTextkey(dynamic optional textkey no defaultText) should contain empty defaultText even if config has a default', () => {
		expect(
			validateTextkey({T:{},key:['optional_textkey2_dynamicdefault_prefix','_postfix'],isDev:true})
		).to.deep.equal({text:'',key:'optional_textkey2_dynamicdefault_prefix_postfix',defaultText:''})
	})
	it('validateTextkey(dynamic optional textkey with defaultText in code) should return empty defaultText', () => {
		expect(
			validateTextkey({T:{},key:['optional_textkey2_dynamicdefault_prefix','_postfix'],defaultText:'optional textkey2 dynamic default {postfix}',isDev:true})
		).to.deep.equal({text:'optional textkey2 dynamic default {postfix}',key:'optional_textkey2_dynamicdefault_prefix_postfix',defaultText:''})
	})
	it('validateTextkey(dynamic optional textkey with default conflict) should throw ERROR_DEFAULT_TEXT_CONFLICT', () => {
		expect(
			() => validateTextkey({T:{},key:['optional_textkey2_dynamicdefault_prefix','_postfix'],defaultText:'optional textkey2 dynamic default diffrent {postfix}',isDev:true})
		).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [optional_textkey2_dynamicdefault_prefix]')
	})
	it('validateTextkey(dynamic required textkey no defaultText) should throw defaultText from config', () => {
		expect(
			validateTextkey({T:{},key:['required_textkey2_dynamic_prefix','_postfix'],isDev:true})
		).to.deep.equal({text:undefined,key:'required_textkey2_dynamic_prefix_postfix',defaultText:'required textkey2 dynamic {postfix}'})
	})
	it('validateTextkey(dynamic required textkey without 2nd array element no defaultText) should return defaultText', () => {
		expect(
			validateTextkey({T:{},key:['required_textkey2_dynamic_prefix'],isDev:true})
		).to.deep.equal({text:undefined,key:'required_textkey2_dynamic_prefix',defaultText:'required textkey2 dynamic {postfix}'})
	})
	it('validateTextkey(dynamic required textkey with default conflict) should throw ERROR_DEFAULT_TEXT_CONFLICT', () => {
		expect(
			() => validateTextkey({T:{},key:['required_textkey2_dynamic_prefix','_postfix'],defaultText:'required textkey2 dynamic diffrent {postfix}',isDev:true})
		).to.throw('ERROR_DEFAULT_TEXT_CONFLICT [required_textkey2_dynamic_prefix]')
	})
	it('validateTextkey(unknown_new key with defaultText) should return default', () => {
		expect(
			validateTextkey({T:{},key:'unknown_new',defaultText:'some default {replacement}',isDev:true})
		).to.deep.equal({text:undefined,key:'unknown_new',defaultText:'some default {replacement}'})
	})
	it('validateTextkey(dynamic required unknown_dynamic_new textkey with defaultText) should return default', () => {
		expect(
			validateTextkey({T:{},key:['unknown_dynamic_new','_postfix'],defaultText:'some dynamic default {postfix}',isDev:true})
		).to.deep.equal({text:undefined,key:'unknown_dynamic_new_postfix',defaultText:'some dynamic default {postfix}'})
	})
	it('validateTextkey(unknown_new key with defaultText) should return default', () => {
		expect(
			validateTextkey({T:{},key:'unknown_new',defaultText:'some default {replacement}',isDev:true})
		).to.deep.equal({text:undefined,key:'unknown_new',defaultText:'some default {replacement}'})
	})
	it('validateTextkey(unknown_new key with defaultText) should return defaultText and update defaultTexts on server side', () => {
		initAutoupdateDefaultTexts({postUri:'some/uri'})
		expect(
			validateTextkey({T:{},key:'unknown_new_to_update',defaultText:'some updated new default {replacement}',isDev:true})
		).to.deep.equal({text:undefined,key:'unknown_new_to_update',defaultText:'some updated new default {replacement}'})
	})
})
