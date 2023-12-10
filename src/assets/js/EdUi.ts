/**
 * @param {String} html HTML representing a single element
 * @return {Node}
 */
export function CreateSingle(html : string) {
	let template = document.createElement(`template`)
	html = html.trim() // Never return a text node of whitespace as the result
	template.innerHTML = html

	if (template.content.firstChild == null) {
		throw `CreateSingle: template.content.firstChild is null`
	} else {
		return template.content.firstChild
	}
}

/**
 * @param {String} html HTML representing any number of sibling elements
 * @return {DocumentFragment}
 */
export function Create(html : string) {
	let template = document.createElement(`template`)
	template.innerHTML = html

	if (template.content == null) {
		throw `Create: template.content is null`
	} else {
		return template.content
	}
}

export function Select(selector : string) : NodeListOf<Element> {
	return document.querySelectorAll(selector)
}

export const hashValue = function(str) {
	let hash = 0
	let i; let chr
	if (str.length === 0) return hash
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = ((hash << 5) - hash) + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

export const edpEmpty = function(elem : Element) {
	elem.innerHTML = ``
	return elem
}

export const edpAppend = function<Type>(frag : Type, elements) : Type {
	if (frag instanceof NodeList) {
		frag.forEach((nde) => edpAppend(nde, elements))

		return frag
	} else if (frag instanceof DocumentFragment || frag instanceof Element) {
		if (typeof elements === `string`) {
			edpAppend(frag, Create(elements))
		} else if (elements instanceof NodeList) {
			let elementsArr = Array.prototype.slice.call(elements)
			for (let index = 0; index < elementsArr.length; index++) {
				const element = elementsArr[index]
				edpAppend(frag, element)
			}
		} else if (Array.isArray(elements)) {
			for (let index = 0; index < elements.length; index++) {
				const element = elements[index]
				edpAppend(frag, element)
			}
		} else if (elements instanceof Node) {
			frag.append(elements)
		}

		return frag
	}
}

export const edpFind = function(elem : Element, selector) {
	return elem.querySelectorAll(selector)
}

class EdApp {
	rootElement = null
	#components = {}
	#state = {}
	#pushManagerInstance = undefined
	#globalIncrement = 0
	getNewIncrement = () => this.#globalIncrement++

	setApplicationRoot(rootElement) {
		this.rootElement = rootElement
	}

	getApplicationRoot() {
		return this.rootElement
	}

	swapModuleInstances(newModule) {
		// console.log(newModule);

		for (const key in newModule) {
			if (Object.hasOwnProperty.call(newModule, key)) {
				const ModuleExported = newModule[key]

				for (const key2 in this.#components) {
					if (Object.hasOwnProperty.call(this.#components, key2)) {
						let component = this.#components[key2]
						// console.log(component)

						if (component.constructor.name === ModuleExported.name) {
							console.log(`hot swapped ${component.constructor.name}`)
							let originalRootElement = component.rootElement
							component = new ModuleExported(component.props, originalRootElement)
							component.render(component.props)
						} else {
							// console.log(`${component.constructor.name} is unchanged`)
						}
					}
				}
			}
		}
	}

	pushManager() {
		if (typeof this.#pushManagerInstance === `undefined`) {
			this.#pushManagerInstance = new EdAppPushManager()
		}

		return this.#pushManagerInstance
	}

	getComponent(ChosenClass, props, domLocation) {
		let hash = hashValue(ChosenClass.toString() + JSON.stringify(props) + domLocation)
		let element = this.#components[hash]
		return element || false
	}

	registerComponent(ChosenClass, props, domLocation) {
		let hash = hashValue(ChosenClass.toString() + JSON.stringify(props) + domLocation)
		this.#components[hash] = new ChosenClass(props)
		return this.#components[hash]
	}

	getState(key) {
		return this.#state[key]
	}

	setState(key, value) {
		this.#state[key] = value
		this.pushManager().propagate(key)
	}
}

class EdAppPushManager {
	listeningObjects : object

	constructor() {
		this.listeningObjects = {}
	}

	async propagate(actionTriggers = []) {
		if (typeof actionTriggers === `string`) {
			actionTriggers = [actionTriggers]
		}

		for (const [key, element] of Object.entries(this.listeningObjects)) {
			for (const actionTrigger of element.actions) {
				if (actionTriggers.includes(actionTrigger)) {
					if (typeof element.callback === `function`) {
						await element.callback(actionTrigger)
					} else {
						delete this.listeningObjects[key]
					}
				}
			}
		}
	}

	register(element) {
		let instance = this

		function generateUniqueKey() {
			function makeid(length) {
				let result = ``
				let characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
				let charactersLength = characters.length
				for (let i = 0; i < length; i++) {
					result += characters.charAt(Math.floor(Math.random() * charactersLength))
				}
				return result
			}

			let uniqueKey

			do {
				uniqueKey = makeid(16)
			} while (instance.listeningObjects.hasOwnProperty(uniqueKey))

			return uniqueKey
		}

		let uniqueKey = generateUniqueKey()

		element.key = uniqueKey
		instance.listeningObjects[uniqueKey] = element

		return uniqueKey
	}
}

export const EdUiComponent = function<Type>(chosenClass : Type, props? : object) {
	let _type = `EdUiComponent`
	let _chosenClass = chosenClass
	let _props = props
	let _domPosition = null
	let _hasInit = false

	return {
		getType() {
			return _type
		},
		getProps() {
			return _props
		},
		setDomPosition(domPosition) {
			_domPosition = domPosition
		},
		Qappend() {
			getEdApp().getComponent(_chosenClass, _props, _domPosition).append(arguments)
		},
		init() {
			if (!_hasInit) {
				_hasInit = true
			}

			if (_domPosition == null) {
				throw `_domPosition not set`
			}

			if ((_chosenClass.prototype instanceof EdUiElement) === false) {
				throw `instance type not recognised`
			}

			let existingInstance = getEdApp().getComponent(_chosenClass, _props, _domPosition)
			if (existingInstance) {
				return existingInstance
			}

			return getEdApp().registerComponent(_chosenClass, _props, _domPosition)
		},
	}
}

export class EdUiElement {
	classAlias = ``
	props = {}
	// rootDiv = document.createElement("div");
	// rootElement = this.rootDiv.attachShadow({mode: 'open'});
	rootElement = null
	rootShadow = null

	proxyHandle = {
		// little hack where we save refrenece to our class inside the object
		main: this,
		/**
         * The apply will be fired each time the function is called
         * @param  target Called function
         * @param  scope  Scope from where function was called
         * @param  args   Arguments passed to function
         * @return        Results of the function
         */
		apply: function(target, scope, args) {
			const funcName = target.name

			// console.log('before', funcName);
			if (funcName === `render`) {
				this.main.rootElement.innerHTML = ``
			}

			// let's call some method of this class to actually check if this is the right instance
			// also remember that you have to exclude methods which you are gonna use
			// inside here to avoid “too much recursion” error
			this.main._free.instanceCheck()

			// here we bind method with our class by accessing reference to instance
			const results = target.bind(this.main)(...args)

			if (funcName !== `define` && funcName !== `render` && funcName !== `setInitialProps`) {
				this.main.render(this.main.props)
			} else if (funcName === `render`) {
				this.main.append(results)
			}

			return (funcName === `render`) ? this.main.rootElement : results
		},
	}

	constructor(initialProps = {}, rootElement = document.createElement(`div`)) {
		this.rootElement = rootElement
		this.rootElement.classList.add(this.constructor.name)
		this.setInitialProps(initialProps)

		// Get all methods of chosen class
		let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this))

		// Find and remove constructor as we don't need Proxy on it
		let consIndex = methods.indexOf(`constructor`)
		if (consIndex > -1) methods.splice(consIndex, 1)

		// Replace all methods with Proxy methods
		methods.forEach(methodName => {
			this[methodName] = new Proxy(this[methodName], this.proxyHandle)
		})

		this.classAlias = `classInstance${getEdApp().getNewIncrement()}`

		this.define()
	}

	// easies trick to do to avoid infinite loop inside apply is to set your functions
	// inside object, as getOwnPropertyNames from prototype will only get methods
	_free = {
		instanceCheck: () => {
			// this will check if this is our EdUiElement class
			// console.log(this.classAlias);
		},
	}

	setInitialProps(initialProps = {}) {
		Object.assign(this.props, initialProps)
	}

	define() {
		return
		throw `define must be implemented in extension class`
	}

	/**
     *
     * @returns array | NodeList | string | Node | Element | EdUiComponent | EdUiElement | DocumentFragment
     */
	render(props = {}) {
	}

	propagationRegistration(actionKeys = [], callback) {
		getEdApp().pushManager().register({
			actions: actionKeys,
			callback,
		})
	}

	append() {
		let argsArr = [].concat.apply([], arguments)
		let elements = argsArr.flat()
		let appendElements = []

		for (const key in elements) {
			if (Object.hasOwnProperty.call(elements, key)) {
				let element = elements[key]

				if (element.hasOwnProperty(`getType`) && element.getType() === `EdUiComponent`) {
					element.setDomPosition(this.classAlias + key)
					appendElements.push(element.init().render(element.getProps()))
				} else {
					appendElements.push(element)
				}
			}
		}
		edpAppend(this.rootElement, appendElements)
	}
}

let edAppRootInstance : EdApp = null

export function createEdAppRoot() : EdApp {
	return edAppRootInstance = new EdApp()
}

export function getEdApp() : EdApp {
	return edAppRootInstance
}
