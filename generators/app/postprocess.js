import dependencies from "./dependencies.js"
import Generator from "yeoman-generator"
import fs from "fs"

export default class extends Generator {
    writing() {
        const packageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))

        switch (this.options.answers.platform) {
            case "Static webserver":
                break
            case "Application Router @ Cloud Foundry":
                packageJson.scripts["build:mta"] = "mbt build"
                packageJson.devDependencies["mbt"] = dependencies["mbt"]
                this.fs.copyTpl(
                    this.templatePath("approuter"),
                    this.destinationRoot(),
                    { title: this.options.answers.projectName }
                )
                break
            case "SAP Build Work Zone, standard edition":

                break
            default:
                // ...
        }

        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))

        // freestyle app template includes launchpad, which we remove manually
        if (!this.options.answers.platform === "SAP Build Work Zone, standard edition" && !this.options.answers.enableFPM) {
            packageJson.scripts["start"] = "fiori run --open index.html"
            packageJson.scripts["start-local"] = "fiori run --config ./ui5-local.yaml --open index.html"
            delete packageJson.scripts["start-noflp"]
            fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))

            fs.unlinkSync(this.destinationPath("webapp/test/flpSandbox.html"))
            fs.unlinkSync(this.destinationPath("webapp/test/locate-reuse-libs.js"))
        }
    }
}