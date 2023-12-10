import { getEdApp, EdUiElement, Create } from "~/assets/js/EdUi"

export default class NavBar extends EdUiElement {
	define() {
		this.propagationRegistration([`logged_in`], async(key) => {
			if (key === `logged_in`) {
				// nothing special to do, just want to re-render
			}
			this.render()
		})
	}

	render() {
		let elem = Create(`<div class='logInButtonContainer'>
			EdJs
			<div>
				<button class='logInButton'>${getEdApp().getState(`logged_in`) ? `Log Out` : `Log In`}</button>
				<button class='edBrownButton'>https://edmundbrown.com</button>
			</div>
		</div>`)
		if (elem == null) {
			return
		}
		elem.querySelector(`button.logInButton`).addEventListener(`click`, () => getEdApp().setState(
			`logged_in`,
			!getEdApp().getState(`logged_in`)
		))
		elem.querySelector(`button.edBrownButton`).addEventListener(`click`, () => window.location.assign(`https://edmundbrown.com`))
		return elem
	}
}
