import dependencies from "../dependencies.js"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"


export default class extends Generator {
    static displayName = "Create a new OpenUI5/SAPUI5 project"

    async prompting() {
        this.answers = {}
        await prompts.call(this)
    }

    async writing() {
        this.answers.projectId = `${this.answers.namespaceUI5}.${this.answers.projectName}` // e.g. com.myorg.myui5project

        if (this.answers.newDir) {
            this.destinationRoot(this.destinationPath(this.answers.projectId))

            // required so that yeoman detects changes to package.json
            // and runs install automatically if newDir === true
            // see https://github.com/yeoman/environment/issues/309
            // this.env.cwd = this.destinationPath()
            // this.env.options.nodePackageManager = "npm"
        }

        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            { title: this.answers.projectId }
        )

        this.fs.copyTpl(
            this.templatePath("package.json"),
            this.destinationPath("package.json"),
            {
                title: this.answers.projectId,
                mbtVersion: dependencies["mbt"]
            }
        )

        this.composeWith("../uimodule/index.js", { answers: this.answers })
        this.composeWith("./platform.js", { answers: this.answers })
    }

    end() {
        if (this.answers.initRepo) {
            this.spawnSync("git", ["init", "--quiet", "-b", "main"], {
                cwd: this.destinationPath()
            });
            this.spawnSync("git", ["add", "."], {
                cwd: this.destinationPath()
            });
            this.spawnSync(
                "git",
                ["commit", "--quiet", "--allow-empty", "-m", "Initialize repository with easy-ui5"],
                {
                    cwd: this.destinationPath()
                }
            );
        }
    }

}