import dependencies from "./dependencies.js"
import Generator from "yeoman-generator"
import fs from "fs"

export default class extends Generator {
    async prompting() {

    }
    writing() {
        const packageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath("webapp/manifest.json")))

        const platformIsApprouter = this.options.answers.platform === "Application Router @ Cloud Foundry"
        const platformIsHTML5AppsRepo = this.options.answers.platform === "SAP HTML5 Application Repository Service for SAP BTP"
        const platformIsSAPBuildWorkZone = this.options.answers.platform === "SAP Build Work Zone, standard edition"

        if (platformIsApprouter) {
            this.fs.copyTpl(
                this.templatePath("standalone-approuter"),
                this.destinationRoot(),
                {
                    projectId: this.options.answers.projectId,
                    approuterVersion: dependencies["@sap/approuter"]
                }
            )

            packageJson.scripts["build"] = "ui5 build --config=ui5.yaml --clean-dest --dest approuter/dist"
            packageJson.scripts["build:mta"] = `mbt build --mtar ${this.options.answers.projectId}.mtar`
            packageJson.scripts["deploy"] = `cf deploy mta_archives/${this.options.answers.projectId}.mtar --retries 0`
            delete packageJson.scripts["deploy-config"]
            packageJson.devDependencies["mbt"] = dependencies["mbt"]
        } else if (platformIsHTML5AppsRepo || platformIsSAPBuildWorkZone) {
            this.fs.copyTpl(
                this.templatePath("managed-approuter"),
                this.destinationRoot(),
                {
                    projectId: this.options.answers.projectId,
                    projectName: this.options.answers.projectName
                }
            )

            packageJson.scripts["clean"] = `rimraf ${this.options.answers.projectId}-content.zip`
            packageJson.scripts["build:ui5"] = "ui5 build --config=ui5.yaml --clean-dest --dest dist"
            packageJson.scripts["zip"] = `cd dist && bestzip ../${this.options.answers.projectId}-content.zip *`
            packageJson.scripts["build"] = "npm-run-all clean build:ui5 zip"
            packageJson.scripts["build:mta"] = `mbt build --mtar ${this.options.answers.projectId}.mtar`
            packageJson.scripts["deploy"] = `cf deploy mta_archives/${this.options.answers.projectId}.mtar --retries 0`
            delete packageJson.scripts["deploy-config"]
            packageJson.devDependencies["mbt"] = dependencies["mbt"]
            packageJson.devDependencies["npm-run-all"] = dependencies["npm-run-all"]
            packageJson.devDependencies["rimraf"] = dependencies["rimraf"]
            packageJson.devDependencies["bestzip"] = dependencies["bestzip"]
        }

        // fix consumption selected ui5 source in index.html (based on answer)

        if (platformIsSAPBuildWorkZone) {
            // add launchpad navigation
            manifestJSON["sap.app"]["crossNavigation"] = {
                "inbounds": {
                    "intent1": {
                        "signature": {
                            "parameters": {},
                            "additionalParameters": "allowed"
                        },
                        "semanticObject": "webapp",
                        "action": "display",
                        "title": this.options.answers.tileName,
                        "icon": "sap-icon://add"
                    }
                }
            }
            manifestJSON["sap.cloud"] = {
                "public": true,
                "service": "basic.service"
            }
        } else {
            // freestyle app template includes launchpad, which we remove manually
            if (!this.options.answers.enableFPM) {
                packageJson.scripts["start"] = "fiori run --open index.html"
                packageJson.scripts["start-local"] = "fiori run --config ./ui5-local.yaml --open index.html"
                delete packageJson.scripts["start-noflp"]
                fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))

                fs.unlinkSync(this.destinationPath("webapp/test/flpSandbox.html"))
                fs.unlinkSync(this.destinationPath("webapp/test/locate-reuse-libs.js"))
            }
        }

        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))
        fs.writeFileSync(this.destinationPath("webapp/manifest.json"), JSON.stringify(manifestJSON))
    }
}