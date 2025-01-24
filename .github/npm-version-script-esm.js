#!/bin/env node

/**
 * This scripts queries the npm registry to pull out the latest version for a given tag.
 */

import assert from 'node:assert'
import child_process from 'node:child_process'
import fs from 'node:fs'
import process from 'node:process'

import semver from 'semver'

const BRANCH_VERSION_PATTERN = /^([A-Z]+)-(\d+\.\d+\.\d+)$/i

// Load the contents of the package.json file
const packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const refArgument = process.argv[2]
const tagArgument = process.argv[3] || 'latest'

if (!refArgument) {
  console.error('ref argument is missing')
  console.error('Usage: npm-version-script-esm.js <ref> [tag]')
  process.exit(1)
}

/**
 * Queries the NPM registry for the latest version for the provided tag.
 * @param tag The tag to query for.
 * @returns {string} Returns the version.
 */
function getTagVersionFromNpm(tag) {
  try {
    return child_process.execSync(`npm info ${packageJSON.name} version --tag="${tag}"`).toString('utf8').trim()
  } catch (e) {
    console.error(`Failed to query the npm registry for the latest version for tag: ${tag}`)
    // throw e;
    return '0.0.0'
  }
}

function desiredTargetVersion(ref) {
  // ref is a GitHub action ref string
  if (ref.startsWith('refs/pull/')) {
    throw new Error('The version script was executed inside a PR!')
  }

  assert(ref.startsWith('refs/heads/'))
  const branchName = ref.slice('refs/heads/'.length)

  const results = branchName.match(BRANCH_VERSION_PATTERN)
  if (results !== null) {
    if (results[1] !== tagArgument) {
      console.warn(`The base branch name (${results[1]}) differs from the tag name ${tagArgument}`)
    }

    return results[2]
  }

  throw new Error(`Malformed branch name for ref: ${ref}. Can't derive the base version. Use a branch name like: beta-x.x.x or alpha-x.x.x`)
}

// derive the base version from the branch ref
const baseVersion = desiredTargetVersion(refArgument)

// query the npm registry for the latest version of the provided tag name
const latestReleasedVersion = getTagVersionFromNpm(tagArgument) // e.g. 0.7.0-beta.12
const latestReleaseBase = semver.inc(latestReleasedVersion, 'patch') // will produce 0.7.0 (removing the preid, needed for the equality check below)

let publishTag
if (semver.eq(baseVersion, latestReleaseBase)) { // check if we are releasing another version for the latest beta or alpha
  publishTag = latestReleasedVersion // set the current latest beta or alpha to be incremented
} else {
  publishTag = baseVersion // start of with a new beta or alpha version
}

// save the package.json
packageJSON.version = publishTag
fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2))

// perform the same change to the package-lock.json
const packageLockJSON = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
packageLockJSON.version = publishTag
fs.writeFileSync('package-lock.json', JSON.stringify(packageLockJSON, null, 2))
