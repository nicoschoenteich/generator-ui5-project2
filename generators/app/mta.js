import Generator from "yeoman-generator"
import fs from "fs"

export default class extends Generator {
    writing() {


        this.fs.copyTpl(
            this.templatePath("mta.yaml"),
            this.destinationPath("mta.yaml"),
            { title: this.options.answers.projectName }
        )

        const packageJson = JSON.parse(fs.readFileSync(this.destinationPath("package.json")))
        packageJson.scripts["build:mta"] = "mbt build"
        fs.writeFileSync(this.destinationPath("package.json"), JSON.stringify(packageJson))
    }
}