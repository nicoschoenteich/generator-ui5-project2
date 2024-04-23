export default async function prompts() {

    this.options.config.uimoduleName = (await this.prompt({
        type: "input",
        name: "uimoduleName",
        message: "How do you want to name your new uimodule",
        validate: (s) => {
            if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
                return true
            }
            return "Please use alpha numeric characters only."
        },
        default: "myui5app2"
    })).uimoduleName

    this.options.config.tileName = (await this.prompt({
        type: "input",
        name: "tileName",
        message: "What name should be displayed on the Fiori Launchpad tile?",
        default: this.options.config.uimoduleName,
        when: this.options.config.platform === "SAP Build Work Zone, standard edition",
    })).tileName

}
