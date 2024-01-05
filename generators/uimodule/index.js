import fs from "fs"
import { generate as writeFPMApp } from "@sap-ux/ui5-application-writer"
import { generate as writeFreestyleApp, TemplateType } from "@sap-ux/fiori-freestyle-writer"
import Generator from "yeoman-generator"
import path from "path"

export default class extends Generator {
    static displayName = "Create a new uimodule within an existing OpenUI5/SAPUI5 project"

    prompting() {
        // check if this is a standalone or embedded call, the latter would contain config
        if (!this.options.config) {
    
        }
    }

    async writing() {
        const rootPackageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        rootPackageJson.workspaces.push(this.options.config.uimoduleName)
        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(rootPackageJson))

        this.destinationRoot(this.destinationPath(this.options.config.uimoduleName))

        const appConfig = {
            app: {
                id: this.options.config.uimoduleName,
                title: this.options.config.tileName || this.options.config.uimoduleName,
                description: `${this.options.config.uimoduleName} description`
            },
            appOptions: {
                loadReuseLibs: true
            },
            package: {
                name: this.options.config.uimoduleName
            },
            ui5: {
                ui5Theme: "sap_horizon"
            }
        }

        if (this.options.config.enableFPM) {
            appConfig.appOptions.sapux = this.options.config.enableFioriTools
            if (this.options.config.enableTypescript) {
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

        this.composeWith("./platform", { config: this.options.config })
        this.composeWith("./ui5Libs", { config: this.options.config })
    }

}