export default async function prompts() {

    this.options.config.uimoduleName = (await this.prompt({
        type: "input",
        name: "uimoduleName",
        message: "How do you want to name your new uimodule",
        validate: (s) => {
            if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
                return true
            }
            return "Please use alpha numeric characters only for the project name."
        },
        default: "myui5app2"
    })).uimoduleName

}