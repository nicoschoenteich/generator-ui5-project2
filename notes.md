- ensure that the plugin works properly even if parameters are missing an may question them again
- proper version check should be introduced

com.myorg.projectname
  package.json
  mta.yaml
  myui5app
    package.json
    ui5.yaml
    webapp

# Benefits of new version

- centrally managed dependencies of generated apps
- centrally managed templates
  - open-ux-tools for uimodules
  - this repo for monorepo architecture and deployment-related files
- modern monorepo approach (using npm workspaces)
- correct usage of namespace, project name and uimodule name 
- no workarounds
- following best practices of yeoman