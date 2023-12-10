import Blurb from "~/assets/components/Blurb"
import { getEdApp, EdUiElement, EdUiComponent, Create } from "~/assets/js/EdUi"

export default class LoggedInApp extends EdUiElement {
	render() {
		let elem = Create(`<div>
            <h1>You are logged in</h1>
            <button>Log Out</button>
        </div>`)

		elem.querySelector(`button`).addEventListener(`click`, () => getEdApp().setState(
			`logged_in`,
			!getEdApp().getState(`logged_in`)
		))

		return [
			elem,
			EdUiComponent(Blurb),
		]
	}
}
