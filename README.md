# The global `.github` for all Homebridge projects

This projects contains any sort of common and community health files for the Homebridge organization
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
```
