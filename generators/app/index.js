import { generate as writeFPMApp } from "@sap-ux/ui5-application-writer"
import { generate as writeFreestyleApp, TemplateType } from "@sap-ux/fiori-freestyle-writer"
import Generator from "yeoman-generator"
import path from "path"
import prompts from "./prompts.js"

export default class extends Generator {async prompting() {
        this.answers = {}
        await prompts.call(this)
    }

    async writing() {
        this.answers.projectId = `${this.answers.namespaceUI5}.${this.answers.projectName}`

        if (this.answers.newDir) {
            this.destinationRoot(this.destinationPath(this.answers.projectId))
        }

        const appConfig = {
            app: {
                id: this.answers.projectId,
                title: this.answers.projectId,
                description: `${this.answers.projectId} description`
            },
            appOptions: {
                loadReuseLibs: true
            },
            package: {
                name: this.answers.projectId
            },
            ui5: {
                ui5Theme: "sap_horizon"
            }
        }
    
        if (this.answers.enableFPM) {
            appConfig.appOptions.sapux = this.answers.enableFioriTools
            if (this.answers.enableTypescript) {
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

        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            { title: this.answers.projectName }
        )

        this.composeWith(path.join(this.contextRoot, "generators/app/postprocess.js"), { answers: this.answers })
    }

}