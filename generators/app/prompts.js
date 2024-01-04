export default async function prompts() {
    this.answers.projectName = (await this.prompt({
        type: "input",
        name: "projectName",
        message: "How do you want to name this project?",
        validate: (s) => {
            if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
                return true
            }
            return "Please use alpha numeric characters only for the project name."
        },
        default: "myui5app"
    })).projectName

    this.answers.namespaceUI5 = (await this.prompt({
        type: "input",
        name: "namespaceUI5",
        message: "Which namespace do you want to use?",
        validate: (s) => {
            if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
                return true
            }
            return "Please use alpha numeric characters and dots only for the namespace."
        },
        default: "com.myorg"
    })).namespaceUI5

    this.answers.enableFPM = (await this.prompt({
        type: "confirm",
        name: "enableFPM",
        message: "Do you want to enable the SAP Fiori elements flexible programming model?",
        default: false
    })).enableFPM

    this.answers.enableTypescript = (await this.prompt({
        type: "confirm",
        name: "enableTypescript",
        message: "Do you want to use the awesomeness of Typescript?",
        default: true,
        when: this.answers.enableFPM
    })).enableTypescript

    this.answers.enableFioriTools = (await this.prompt({
        type: "confirm",
        name: "enableFioriTools",
        message: "Do you want the module to be visible in the SAP Fiori tools?",
        default: true,
        when: this.answers.enableFPM
    })).enableFioriTools

    this.answers.platform = (await this.prompt({
        type: "list",
        name: "platform",
        message: "On which platform would you like to host the application?",
        choices: [
            "Static webserver",
            "Application Router @ Cloud Foundry",
            "SAP HTML5 Application Repository Service for SAP BTP",
            "SAP Build Work Zone, standard edition",
            "Application Router @ SAP HANA XS Advanced",
            "SAP NetWeaver"
        ],
        default: "Static webserver"
    })).platform

    this.answers.tileName = (await this.prompt({
        type: "input",
        name: "tileName",
        message: "What name should be displayed on the Fiori Launchpad tile?",
        default: `${this.answers.namespaceUI5}.${this.answers.projectName}`,
        when: this.answers.platform === "SAP Build Work Zone, standard edition",
    })).tileName

    this.answers.ui5Libs = (await this.prompt({
        type: "list",
        name: "ui5Libs",
        message: "Where should your UI5 libs be served from?",
        choices: () => {
            return this.answers.platform !== "SAP Build Work Zone, standard edition" && !this.answers.enableFPM // limit to SAPUI5 for some use cases
                ? [
                      "Content delivery network (OpenUI5)",
                      "Content delivery network (SAPUI5)",
                      "Local resources (OpenUI5)",
                      "Local resources (SAPUI5)"
                  ]
                : ["Local resources (SAPUI5)"]
        },
        default: () => {
            return this.answers.platform !== "SAP Build Work Zone, standard edition" && !this.answers.enableFPM
                ? "Content delivery network (OpenUI5)"
                : "Local resources (SAPUI5)"
        }
    })).ui5Libs

    this.answers.newDir = (await this.prompt({
        type: "confirm",
        name: "newDir",
        message: "Would you like to create a new directory for the project?",
        default: true
    })).newDir

    this.answers.initRepo = (await this.prompt({
        type: "confirm",
        name: "initRepo",
        message: "Would you like to initialize a local git repository for the project?",
        default: true
    })).initRepo
}