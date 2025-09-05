<p align="center">
  <a href="https://homebridge.io"><img src="https://raw.githubusercontent.com/homebridge/branding/latest/logos/homebridge-color-round-stylized.png" height="140"></a>
</p>
<span align="center">

# `.github`

</span>

This project contains any sort of common and community health files for the Homebridge organization
to be maintained in a central space.

## Reusable GitHub Workflows

This project provides several GitHub workflows that can be [reused](https://docs.github.com/en/actions/learn-github-actions/reusing-workflows).

This example, which is cited from the above-linked GitHub documentation page, shows how such
reusable workflow files are generally used:

```yaml
name: Call a reusable workflow

on:
  pull_request:
    branches:
      - latest

jobs:
  call-workflow:
    uses: homebridge/.github/.github/workflows/example-workflow.yml@latest

  call-workflow-passing-data:
    uses: homebridge/.github/.github/workflows/example-workflow.yml@latest
    with:
      username: mona
    secrets:
      token: ${{ secrets.TOKEN }}

  # Example using the new dependency bot workflow
  dependency-update:
    uses: homebridge/.github/sharedWorkflows/homebridge-dependency-bot.yml@latest
    with:
      config_file: '.github/homebridge-dependency-bot.json'
      release_stream: 'beta'
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

### Homebridge Dependency Bot

The `homebridge-dependency-bot.yml` workflow is a reusable workflow that automatically updates package dependencies in your repository. It supports any release stream (beta, alpha, stable, etc.) and can manage multiple directories and packages.

**Key Features:**
- Support for any release stream (not just beta)
- Multiple directory and package management
- Automatic PR creation and optional auto-merge
- Flexible package version selection (exact tags or pattern matching)

**Usage:**
```yaml
name: Update Dependencies

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  update-beta:
    uses: homebridge/.github/sharedWorkflows/homebridge-dependency-bot.yml@latest
    with:
      config_file: '.github/homebridge-dependency-bot.json'
      release_stream: 'beta'
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

**Configuration File Example** (`.github/homebridge-dependency-bot.json`):
```json
{
  "git_user": {
    "name": "Homebridge Dependency Bot",
    "email": "actions@github.com"
  },
  "auto_merge": false,
  "directories": [
    {
      "directory": ".",
      "packages": [
        {
          "name": "homebridge",
          "tag": "beta"
        },
        {
          "name": "@homebridge/plugin-ui-x",
          "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+-beta\\.[0-9]+$"
        }
      ]
    }
  ]
}
```

**Legacy Usage:** The original `homebridge-beta-bot.yml` workflow is still available at `.github/workflows/homebridge-beta-bot.yml` for backward compatibility.
