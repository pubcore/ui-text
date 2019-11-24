import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
var mockHttp = new MockAdapter(axios)
mockHttp.onPost('/register').reply(200)
import {registerDefaultText} from '../src/index'
import {ok} from 'assert'
const config = {uri:'/register', registerDefaultTextTimeout:1}

describe('Register default texts callback', () => {
	it('on success', () =>
		ok(registerDefaultText(config)({key:'test', text:'test', config}).test==='test')
	)
})