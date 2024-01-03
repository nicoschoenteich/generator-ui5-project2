import Generator from "yeoman-generator"
import fs from "fs"
// import path from "path"

export default class extends Generator {
    writing() {
        // const projectId = `${this.options.answers.namespaceUI5}.${this.options.answers.projectName}`

        const platformIsLaunchpad = this.options.answers.platform === "SAP Build Work Zone, standard edition"
        const packageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))

        // freestyle app template includes launchpad, which we remove manually
        if (!platformIsLaunchpad && !this.options.answers.enableFPM) {
            packageJson.scripts["start"] = "fiori run --open index.html"
            packageJson.scripts["start-local"] = "fiori run --config ./ui5-local.yaml --open index.html"
            delete packageJson.scripts["start-noflp"]
            fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))

            fs.unlinkSync(this.destinationPath("webapp/test/flpSandbox.html"))
            fs.unlinkSync(this.destinationPath("webapp/test/locate-reuse-libs.js"))
        }

        // no launchpad, fpm app
        // nothing to do, fpm app comes with no launchpad

        // launchpad, freestyle app
        // nothing to do, freestyle app comes with launchpad

        // launchpad, fpm app
        // if (platformIsLaunchpad && this.options.answers.enableFPM) {
        //     this.fs.copyTpl(
        //         path.join(this.contextRoot, "generators/_launchpad/templates/flpSandbox.html"), // for some reason the this.templatePath() is broken at this point
        //         this.destinationPath("webapp/test/flpSandbox.html"),
        //         { title: projectId }
        //     )
        // }


    }
}