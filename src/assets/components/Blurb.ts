import { Create, EdUiElement } from "~/assets/js/EdUi"

export default class Blurb extends EdUiElement {
	render() {
		return Create(`<h2>EdUI is a practice run at creating a modern JavaScript framework in TypeScript.</h2>
		<br>
		<h3>Links</h3>
		<div>
			<button style='width: 100%;' onclick='window.location.assign("https://edmundbrown.com")' class='edBrownButton'>https://edmundbrown.com</button>
		</div>
		<br>
		<h3>Production features</h3>
		<ul>
		<li>Built in Application State Management</li>
		<li>Virtual DOM (Custom)</li>
		<li>State memory / dynamic rendering via prop changes</li>
		</ul>

		<h3>Development features</h3>
		<ul>
		<li>The development environment supports HMR via Vite</li>
		<li>DOM class names added automatically matching JS class name.</li>
		</ul>`)
	}
}
