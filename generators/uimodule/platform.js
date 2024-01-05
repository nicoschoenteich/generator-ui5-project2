import dependencies from "../dependencies.js"
import fs from "fs"
import Generator from "yeoman-generator"
import yaml from "yaml"

export default class extends Generator {
    writing() {
        const uimodulePackageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        const manifestJSON = JSON.parse(fs.readFileSync(this.destinationPath("webapp/manifest.json")))

        const platformIsWebserver = this.options.answers.platform === "Static webserver"
        const platformIsApprouter = this.options.answers.platform === "Application Router @ Cloud Foundry"
        const platformIsHTML5AppsRepo = this.options.answers.platform === "SAP HTML5 Application Repository Service for SAP BTP"
        const platformIsSAPBuildWorkZone = this.options.answers.platform === "SAP Build Work Zone, standard edition"
        
        delete uimodulePackageJson.scripts["deploy"]
        delete uimodulePackageJson.scripts["deploy-config"]

        if (platformIsWebserver) {
            uimodulePackageJson.scripts["build"] = `ui5 build --config=ui5.yaml --clean-dest --dest ../dist/${this.options.answers.uimoduleName}`
        } else if (platformIsApprouter) {
            uimodulePackageJson.scripts["build"] = `ui5 build --config=ui5.yaml --clean-dest --dest ../approuter/dist/${this.options.answers.uimoduleName}`
        } else if (platformIsHTML5AppsRepo || platformIsSAPBuildWorkZone) {
            uimodulePackageJson.scripts["clean"] = `rimraf ${this.options.answers.uimoduleName}-content.zip`
            uimodulePackageJson.scripts["build:ui5"] = "ui5 build --config=ui5.yaml --clean-dest --dest dist"
            uimodulePackageJson.scripts["zip"] = `cd dist && bestzip ../${this.options.answers.uimoduleName}-content.zip *`
            uimodulePackageJson.scripts["build"] = "npm-run-all clean build:ui5 zip"
            
            uimodulePackageJson.devDependencies["npm-run-all"] = dependencies["npm-run-all"]
            uimodulePackageJson.devDependencies["rimraf"] = dependencies["rimraf"]
            uimodulePackageJson.devDependencies["bestzip"] = dependencies["bestzip"]

            const rootMtaYaml = yaml.parse(fs.readFileSync(this.destinationPath("../mta.yaml")).toString())
            rootMtaYaml.modules.forEach(module => {
                if (module.name === `${this.options.answers.projectId}-ui-deployer`) {
                    module["build-parameters"]["requires"].push({
                        "artifacts": [
                            `${this.options.answers.uimoduleName}-content.zip`
                        ],
                        "name": this.options.answers.uimoduleName,
                        "target-path": "resources/"
                    })
                }
            })
            rootMtaYaml.modules.push({
                "name": this.options.answers.uimoduleName,
                "type": "html5",
                "path": this.options.answers.uimoduleName,
                "build-parameters": {
                    "supported-platforms": []
                }
            })
            fs.writeFileSync(this.destinationPath("../mta.yaml"), yaml.stringify(rootMtaYaml))
        }

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
                uimodulePackageJson.scripts["start"] = "fiori run --open index.html"
                delete uimodulePackageJson.scripts["start-noflp"]
                fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(uimodulePackageJson))

                fs.unlinkSync(this.destinationPath("webapp/test/flpSandbox.html"))
                fs.unlinkSync(this.destinationPath("webapp/test/locate-reuse-libs.js"))
            }
        }

        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(uimodulePackageJson))
        fs.writeFileSync(this.destinationPath("webapp/manifest.json"), JSON.stringify(manifestJSON))
    }
}