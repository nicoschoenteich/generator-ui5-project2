import chalk from "chalk"

export async function lookForParentUI5ProjectAndPrompt(prompts) {
	this.options.config = this.config.getAll()
	if (Object.keys(this.options.config).length === 0) {
		this.log(`${chalk.blue("We couldn't find a parent UI5 project with existing uimodules, but you can create one by running")} ${chalk.yellow("yo easy-ui5 project")}${chalk.blue(".")}`)
		this.cancelCancellableTasks()
	} else {
		await prompts.call(this)
	}
}
