export default async function prompts() {

	if (this.options.config.uimodules.length === 1) {
		this.options.config.uimodule = this.options.config.uimodules[0]
	} else {
		this.options.config.uimodule = (await this.prompt({
			type: "list",
			name: "uimodule",
			message: "To which uimodule do you want to add a new model?",
			choices: this.options.config.uimodules
		})).uimodule
	}

	this.options.config.viewName = (await this.prompt({
		type: "input",
		name: "viewName",
		message: "How do you want to name your new view?",
		validate: (s) => {
			if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
				if (s !== "") {
					return true
				}
			}
			return "Please use a non-empty value and alpha numeric characters only."
		}
	})).viewName

	this.options.config.setupController = (await this.prompt({
		type: "confirm",
		name: "setupController",
		message: "Do you want to set up a JavaScript controller for your new view?"
	})).setupController

		this.options.config.setupRouteTarget = (await this.prompt({
		type: "confirm",
		name: "setupRouteTarget",
		message: "Do you want to set up a route and target for your new view?"
	})).setupRouteTarget

}
