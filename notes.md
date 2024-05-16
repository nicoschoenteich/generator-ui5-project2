# TO-DO

- opa
- qunit
- minimalistic version

- ensure that the plugin works properly even if parameters are missing an may question them again
- proper version check should be introduced

# Benefits of new version

- centrally managed dependencies of generated apps
- centrally managed templates
  - open-ux-tools for uimodules
  - this repo for monorepo architecture and deployment-related files
- modern monorepo approach (using npm workspaces)
- correct usage of namespace, project name and uimodule name 
- no workarounds
- following best practices of yeoman
- no `try {} catch {}` quick fixes
- clearer variable names
- instantly deployable
- better file structure, e.g. usage of `prompts.js` for every subgenerator
- better usage of central helper methods to reduce redundencies
- remove confusion when calling the project generator and it asked for app vs. webapp creation
- less yeoman conflicts upon project creation for a smoother experience

## Easy UI5 project generator 2.0 - a new implementation and best practices

In this talk we will dive into the newest implementation of the Easy UI5 project generator (generator-ui5-project) and its benefits. We will also talk about new best practices for project architectures with multiple UI(5) modules and how you can follow them using the new generator-ui5-project.

## Breaking changes

### model

- We renamed the `newmodel` subgenerator to `model`. After all, we also call it `project` generator (and not `newproject` generator) 🙂
- remove `bindingMode` option
- remove `countMode` option
- We now (optionally) automatically set up a proxy for new models using the `fiori-tools-proxy`.

### fpmpage

- `enablefpm` subgenerator now part of the more extensive `fpmpage` subgenerator, as it couldn't really be called standalone anyway
