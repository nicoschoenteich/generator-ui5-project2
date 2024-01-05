import fs from "fs"
import { generate as writeFPMApp } from "@sap-ux/ui5-application-writer"
import { generate as writeFreestyleApp, TemplateType } from "@sap-ux/fiori-freestyle-writer"
import Generator from "yeoman-generator"
import path from "path"

export default class extends Generator {
    static displayName = "Create a new uimodule within an existing OpenUI5/SAPUI5 project"

    async writing() {
        const rootPackageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        rootPackageJson.workspaces.push(this.options.answers.uimoduleName)
        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(rootPackageJson))

        // TO-DO: is standalone call?
        // TO-DI move gitignore one level up

        this.destinationRoot(this.destinationPath(this.options.answers.uimoduleName))

        const appConfig = {
            app: {
                id: this.options.answers.uimoduleName,
                title: this.options.answers.tileName || this.options.answers.uimoduleName,
                description: `${this.options.answers.uimoduleName} description`
            },
            appOptions: {
                loadReuseLibs: true
            },
            package: {
                name: this.options.answers.uimoduleName
            },
            ui5: {
                ui5Theme: "sap_horizon"
            }
        }

        if (this.options.answers.enableFPM) {
            appConfig.appOptions.sapux = this.options.answers.enableFioriTools
            if (this.options.answers.enableTypescript) {
                appConfig.appOptions.typescript = true
            }
            await writeFPMApp(this.destinationRoot(), appConfig, this.fs)
        } else {
            appConfig.template = {
                type: TemplateType.Basic,
                settings: {
                    viewName: "MainView"
                }
            }
            await writeFreestyleApp(this.destinationRoot(), appConfig, this.fs)
        }

        this.composeWith("./platform", { answers: this.options.answers })
        this.composeWith("./ui5Libs", { answers: this.options.answers })
    }

}