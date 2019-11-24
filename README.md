# Localize text via text-key to text-value objects
Whenever we code interfaces for human users it is very likely we need to show some text. An example of a simple React based component with some "Hello World" text may look like this:
```javascript
import React from 'react'

export default function Dialog(){
	return <h1>Hello World</h2>
}
```
If we have to support more than one language and don't want to duplicate interface's code, this library can be used. It is build to to create a text-function initialzed and configured in application's global context. The text-function is imported where ever a text is needed. So instead of hard code a text, a text-key string "title" is used. (irrelevant codelines are replace with "[..]"):
```javascript
[..]
import T from '../lib/text.mjs'

[..]
	return <h1>{ T('title') }</h2>
[..]
```
If we assume the langauge is a global setting (which is the case for most interfaces) we define the text-function bound to current language's text object, in this example within the "text.mjs" file:
#### Initialization and creation of the text-function (global scope)
```javascript
import uiText from '@pubcore/ui-text'

//example text data, it may come from a content management system
//where texts are translated and maintained
const text = {
	title: 'Hello World'
}

export default (...args) => uiText(text, ...args)
```

#### Code examples
###### Text with some replacement
```javascript
<h1>{ T('title', 'Hello World! #{count} example', {count:2}) }</h1>
//result: <h1>Hello World! #2 example</h1>
```
###### Shortcut for short and generic meaning text
If key contains whitespaces, it will be transformed to snake case, here key will be "sort_descent"
```javascript
<item>{ T('Sort descent') }</item>
//result: <item>Sort descent</item>
```
This will lead to text-key "cancel" (text-keys are snake-case)
```javascript
<button>{ T('Cancel') }</button>
//result: <button>Cancel</button>
```
###### Optional text
Optional text may not be defined in language-text-object and therefore it
will not trigger errors or fall back to any default text. If a default text is not defined, an empty string is returned. This is especially usefull if dynamic text-keys are created having a static prefix and some dynamic postfix:
```javascript
//a text is optional, if it's text-key is defined as array
var color = 'blue'
[..]
<div>{ T(['additional_info_', color]) }</div>
```

#### Options
Per default the text function does work in production mode.
If set to development mode the behaviour changes:
In __development__ mode
* __registerDefaultText__ callback is called (if configured) which can be used to auto-save, register or alert new or missing text-values for requested keys. A text-key is treated as new, if it does not exists in language-text-object.
* An Error is thrown, if no default text is defined for a called text-key


```javascript
import uiText from '@pubcore/ui-text'

[..]
const options = {
	envType:'development', //default: production
	defaultTexts:{}, //text-key-value object
	registerDefaultText: (text) => {} //callback function
}

export default (...args) => uiText(text, ...args, options)
```


