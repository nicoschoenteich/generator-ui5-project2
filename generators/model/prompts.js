import chalk from "chalk"

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

	this.options.config.modelName = (await this.prompt({
		type: "input",
		name: "modelName",
		message: "How do you want to name your new model? (Press enter for default model.)",
		validate: (s) => {
			if (/^[a-zA-Z0-9_-]*$/g.test(s)) {
				return true
			}
			return "Please use alpha numeric characters only."
		},
		default: ""
	})).modelName

	this.options.config.modelType = (await this.prompt({
		type: "list",
		name: "modelType",
		message: "Which type of model do you want to add?",
		choices: ["OData v4", "OData v2", "JSON"],
		default: "OData v4"
	})).modelType

	this.options.config.modelUrl = (await this.prompt({
		type: "input",
		name: "modelUrl",
		message: "What is the data source url?",
		when: this.options.config.modelType.includes("OData"),
		validate: (s) => {
			if (new URL(s) instanceof Error) {
				return 	// no error message required, yeoman will forward an error to the user
			}
			return true
		}
	})).modelUrl

	this.options.config.setupProxy = (await this.prompt({
		type: "confirm",
		name: "setupProxy",
		message: "Do you want to set up a proxy for the new model?",
		when: this.options.config.modelType.includes("OData")
	})).setupProxy

}
