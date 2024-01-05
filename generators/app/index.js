import dependencies from "../dependencies.js"
import Generator from "yeoman-generator"
import prompts from "./prompts.js"

export default class extends Generator {
    static displayName = "Create a new OpenUI5/SAPUI5 project"

    async prompting() {
        this.answers = {}
        await prompts.call(this)
        this.config.set(this.answers)
    }

    async writing() {
        this.config.set("projectId", `${this.config.get("namespaceUI5")}.${this.config.get("projectName")}`) // e.g. com.myorg.myui5project
        if (this.config.get("newDir")) {
            this.destinationRoot(this.destinationPath(this.config.get("projectId")))

            // required so that yeoman detects changes to package.json
            // and runs install automatically if newDir === true
            // see https://github.com/yeoman/environment/issues/309
            // this.env.cwd = this.destinationPath()
            // this.env.options.nodePackageManager = "npm"
        }

        this.fs.copyTpl(
            this.templatePath("package.json"),
            this.destinationPath("package.json"),
            {
                title: this.config.get("projectId"),
                mbtVersion: dependencies["mbt"]
            }
        )
    
        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            { title: this.config.get("projectId") }
        )

        this.fs.copyTpl(
            this.templatePath(".gitignore"),
            this.destinationPath(".gitignore")
        )

        this.composeWith("../uimodule/index.js")
        this.composeWith("./platform.js")
    }

    end() {
        if (this.config.get("initRepo")) {
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