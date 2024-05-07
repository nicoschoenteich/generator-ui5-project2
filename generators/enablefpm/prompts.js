export default async function prompts() {

	// this subgenerator might be called before uimodules array gets created during end() as part of ../uimodule/index.js
	if (!this.options.config.uimodules) {
		this.options.config.uimodule = this.options.config.uimoduleName
	} else if (this.options.config.uimodules?.length === 1) {
		this.options.config.uimodule = this.options.config.uimodules[0]
	} else {
		this.options.config.uimodule = (await this.prompt({
			type: "list",
			name: "uimodule",
			message: "For which uimodule do you want to enable the Fiori elements flexible programming model?",
			choices: this.options.config.uimodules
		})).uimodule
	}

	if (!this.options.config.enableFPM) {
		this.options.config.replaceComponent = (await this.prompt({
			type: "confirm",
			name: "replaceComponent",
			message: "Do you want to replace your App Component?",
			default: false
		})).replaceComponent
	} else {
		this.options.config.replaceComponent = false // not neccessary if enableFPM is true to begin with
	}
}
