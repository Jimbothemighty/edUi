import { getEdApp, EdUiElement, EdUiComponent } from "~/assets/js/EdUi"

class FooterColumnElement extends EdUiElement {
	render(props) {
		return props.label
	}
}

class FooterColumn extends EdUiElement {
	render(props) {
		if (props && props.children) {
			return props.children
		}

		return `Empty`
	}
}

export default class Footer extends EdUiElement {
	define() {
		this.propagationRegistration([`logged_in`], async(key) => {
			if (key === `logged_in`) {
				// nothing special to do, just want to re-render
			}
			this.render()
		})
	}

	render() {
		return [
			EdUiComponent(FooterColumn, {
				children: [
					EdUiComponent(FooterColumnElement, { label: getEdApp().getState(`logged_in`) ? `Log Out` : `Log In` }),
					EdUiComponent(FooterColumnElement, { label: `Terms and Conditions` }),
					EdUiComponent(FooterColumnElement, { label: `Privacy Policy` }),
				],
			}),
			EdUiComponent(FooterColumn),
			EdUiComponent(FooterColumn),
		]
	}
}
