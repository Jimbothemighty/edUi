
import { App } from "~/assets/components/App"
import { createEdAppRoot, edpAppend } from "~/assets/js/EdUi"

createEdAppRoot().setApplicationRoot(
	document.querySelector(`.wrapper`)
)

edpAppend(document.querySelector(`.wrapper`), (new App()).render())
