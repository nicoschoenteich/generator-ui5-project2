import fs from "fs"
import { generate as writeFPMApp } from "@sap-ux/ui5-application-writer"
import { generate as writeFreestyleApp, TemplateType } from "@sap-ux/fiori-freestyle-writer"
import Generator from "yeoman-generator"
import path from "path"

export default class extends Generator {
    static displayName = "Create a new uimodule within an existing OpenUI5/SAPUI5 project"

    async writing() {
        const rootPackageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        rootPackageJson.workspaces.push(this.config.get("uimoduleName"))
        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(rootPackageJson))

        // TO-DO: is standalone call?

        this.destinationRoot(this.destinationPath(this.config.get("uimoduleName")))

        const appConfig = {
            app: {
                id: this.config.get("uimoduleName"),
                title: this.config.get("tileName") || this.config.get("uimoduleName"),
                description: `${this.config.get("uimoduleName")} description`
            },
            appOptions: {
                loadReuseLibs: true
            },
            package: {
                name: this.config.get("uimoduleName")
            },
            ui5: {
                ui5Theme: "sap_horizon"
            }
        }

        if (this.config.get("enableFPM")) {
            appConfig.appOptions.sapux = this.config.get("enableFioriTools")
            if (this.config.get("enableTypescript")) {
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

        this.composeWith("./platform")
        this.composeWith("./ui5Libs")
    }

}