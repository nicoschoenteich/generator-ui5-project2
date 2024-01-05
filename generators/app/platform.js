import dependencies from "../dependencies.js"
import fs from "fs"
import Generator from "yeoman-generator"

export default class extends Generator {
    writing() {
        const platformIsWebserver = this.options.answers.platform === "Static webserver"
        const platformIsApprouter = this.options.answers.platform === "Application Router @ Cloud Foundry"
        const platformIsHTML5AppsRepo = this.options.answers.platform === "SAP HTML5 Application Repository Service for SAP BTP"
        const platformIsSAPBuildWorkZone = this.options.answers.platform === "SAP Build Work Zone, standard edition"
        
        if (platformIsWebserver) {
            this.fs.copyTpl(
                this.templatePath("static"),
                this.destinationRoot(),
                {
                    projectId: this.options.answers.projectId
                }
            )
        } else if (platformIsApprouter) {
            this.fs.copyTpl(
                this.templatePath("standalone-approuter"),
                this.destinationRoot(),
                {
                    projectId: this.options.answers.projectId,
                    approuterVersion: dependencies["@sap/approuter"]
                }
            )
        } else if (platformIsHTML5AppsRepo || platformIsSAPBuildWorkZone) {
            this.fs.copyTpl(
                this.templatePath("managed-approuter/mta.yaml"),
                this.destinationPath("mta.yaml"),
                {
                    projectId: this.options.answers.projectId,
                    projectName: this.options.answers.projectName
                }
            )
            this.fs.copyTpl(
                this.templatePath("managed-approuter/xs-security.json"),
                this.destinationPath("xs-security.json"),
                {
                    projectId: this.options.answers.projectId,
                    projectName: this.options.answers.projectName
                }
            )
            this.fs.copyTpl(
                this.templatePath("managed-approuter/xs-app.json"),
                this.destinationPath(`${this.options.answers.uimoduleName}/webapp/xs-app.json`)
            )
        }
    }
}