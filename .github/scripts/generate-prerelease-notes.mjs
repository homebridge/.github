// Generates the release notes for a beta or alpha GitHub pre-release: commits since the
// previous tag, the pending CHANGELOG.md section (if any) and a testing link.
//
// Used by: .github/workflows/npm-release.yml, in the pre-release job. That workflow downloads
// this file from the latest branch at run time and runs it in the calling package's checkout,
// which needs full git history and tags (fetch-depth: 0).
//
// Usage: node generate-prerelease-notes.mjs --version 1.2.3-beta.0 --type beta --output notes.md

import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

function argument(name) {
  const index = process.argv.indexOf(`--${name}`)
  if (index === -1 || !process.argv[index + 1]) {
    throw new Error(`Missing required --${name} argument`)
  }
  return process.argv[index + 1]
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim()
}

function tags(pattern) {
  const output = git('tag', '--merged', 'HEAD', '--list', pattern, '--sort=-version:refname')
  return output
    ? output.split('\n')
    : []
}

function warn(message) {
  console.log(`::warning::${message}`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `> [!WARNING]\n> ${message}\n\n`)
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const version = argument('version')
const releaseType = argument('type')
const outputPath = argument('output')
const prereleaseMarker = `-${releaseType}.`
const markerIndex = version.lastIndexOf(prereleaseMarker)

if (markerIndex === -1) {
  throw new Error(`Version ${version} is not a ${releaseType} prerelease`)
}

const baseVersion = version.slice(0, markerIndex)
const currentTag = `v${version}`
const expectedHeading = new RegExp(`^## v${escapeRegExp(baseVersion)} \\((?:pending|pending release)\\)\\s*$`, 'i')
const changelogLines = existsSync('CHANGELOG.md')
  ? readFileSync('CHANGELOG.md', 'utf8').split('\n')
  : []
const sectionStart = changelogLines.findIndex(line => expectedHeading.test(line))
const earlierVersion = sectionStart === -1
  ? undefined
  : changelogLines.slice(0, sectionStart).find(line => line.startsWith('## '))
let cumulativeNotes = ''

if (sectionStart !== -1 && !earlierVersion) {
  const nextSectionOffset = changelogLines.slice(sectionStart + 1).findIndex(line => line.startsWith('## '))
  const sectionEnd = nextSectionOffset === -1
    ? changelogLines.length
    : sectionStart + 1 + nextSectionOffset
  cumulativeNotes = changelogLines.slice(sectionStart + 1, sectionEnd).join('\n')
    .replace(/^### .*\n(?:[ \t]*\n)*(?=### |$(?![\s\S]))/gm, '')
    .trim()
}

if (!cumulativeNotes) {
  warn(`No usable v${baseVersion} pending changelog section found, so these notes only list commits.`)
}

const previousPrerelease = tags(`v${baseVersion}-${releaseType}.*`).find(tag => tag !== currentTag)
const newestPrerelease = git('tag', '--list', `v${baseVersion}-${releaseType}.*`, '--sort=-version:refname')
  .split('\n')
  .find(tag => tag && tag !== currentTag)
const branchRewritten = newestPrerelease && newestPrerelease !== previousPrerelease
const previousStable = tags('v[0-9]*.[0-9]*.[0-9]*').find(tag => !tag.includes('-'))
const comparisonTag = previousPrerelease || previousStable
const range = comparisonTag
  ? `${comparisonTag}..HEAD`
  : 'HEAD'
const rawCommits = git('log', range, '--format=%h%x09%s')
const repository = process.env.GITHUB_REPOSITORY
const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com'
const commitNotes = rawCommits
  ? rawCommits.split('\n').map((line) => {
      const [hash, ...subjectParts] = line.split('\t')
      return `- ${subjectParts.join('\t')} ([\`${hash}\`](${serverUrl}/${repository}/commit/${hash}))`
    }).join('\n')
  : '- No additional commits since the previous test release.'
const releaseLabel = releaseType === 'beta'
  ? 'beta'
  : 'alpha'
const comparisonHeading = comparisonTag
  ? `Changes since ${comparisonTag}`
  : 'Changes in this test release'
const comparisonLink = comparisonTag
  ? `\n\n[View the full comparison](${serverUrl}/${repository}/compare/${comparisonTag}...${currentTag})`
  : ''
const rewrittenNote = branchRewritten
  ? `> [!NOTE]\n> The branch was rewritten after ${newestPrerelease}, so this list covers everything since ${comparisonTag || 'the start of the repository'}, not only what is new.\n\n`
  : ''
const cumulativeSection = cumulativeNotes
  ? `\n\n## Everything included in the v${baseVersion} ${releaseLabel}\n\n${cumulativeNotes}`
  : ''

const notes = `
> [!WARNING]
> This ${releaseLabel} test release is not recommended for production systems.

## ${comparisonHeading}

${rewrittenNote}${commitNotes}${comparisonLink}${cumulativeSection}

## Testing

[How To Test Upcoming Changes](${serverUrl}/${repository}/wiki/How-To-Test-Upcoming-Changes)
`

writeFileSync(outputPath, notes)
console.log(`Generated ${outputPath} using ${comparisonTag || 'the complete history'}${cumulativeNotes
  ? ` and the v${baseVersion} pending changelog section`
  : ''}.`)
