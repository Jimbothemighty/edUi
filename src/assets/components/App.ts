import { getEdApp, EdUiElement, EdUiComponent } from "~/assets/js/EdUi"
import NavBar from "./NavBar"
import LogInForm from "./LogInForm"
import LoggedInApp from "./LoggedInApp"
import Footer from "./Footer"
import "~/assets/css/style.css"

export class App extends EdUiElement {
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
			EdUiComponent(NavBar),
			EdUiComponent(getEdApp().getState(`logged_in`) ? LoggedInApp : LogInForm),
			EdUiComponent(Footer),
		]
	}
}
