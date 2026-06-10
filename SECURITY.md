# Security Policy

This document outlines security procedures and general policies for the Homebridge project.

- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Disclosure Policy](#disclosure-policy)
- [Comments on this Policy](#comments-on-this-policy)

---

## Reporting a Vulnerability

We want to ensure that all Homebridge projects are secure for everyone. If you've discovered a security vulnerability, we appreciate your help in disclosing it to us in a [responsible manner][link-responsible-disclosure].

Publicly disclosing a vulnerability can put the entire community at risk. Please do not open a public GitHub issue. Instead, email the security team at [mail](mailto:bwp91@icloud.com,northern.man1@gmail.com,beckersmarthome@icloud.com,homebridge-security@andi-bauer.com,dev@oz.nu?subject=%5BHB-SECURITY%5D). Please include the following in your report:

- A description of the vulnerability and its potential impact
- The affected project(s) and version(s)
- Steps to reproduce or proof of concept
- Any suggested mitigations if known

We consider correspondence sent to this address our highest priority. The security team will acknowledge your report within 48 hours and provide a more detailed response within 96 hours outlining the next steps. We will endeavour to keep you informed of progress toward a fix throughout the process and may follow up for additional information or guidance.

Please report security bugs in third-party modules to the person or team maintaining that module.

## Disclosure Policy

When a vulnerability report is received, a primary handler will be assigned to coordinate the fix and release process:

- Confirm the vulnerability and determine the affected versions
- Audit the codebase for similar issues
- Prepare and release fixes for all versions currently under active maintenance as quickly as possible
- Coordinate disclosure timing with the reporter where possible; we ask for a reasonable embargo period to allow fixes to reach users before public disclosure

We assess all reports against CVSS v3.1 scoring criteria. Where the attack complexity, prerequisites, or deployment context of the Homebridge ecosystem result in a score that does not meet the threshold for a CVE, we will communicate that assessment clearly to the reporter with our reasoning.

We do not currently operate a bug bounty programme.

After a security vulnerability has been corrected, a hotfix release will be deployed as soon as possible.

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a pull request.

[link-responsible-disclosure]: http://en.wikipedia.org/wiki/Responsible_disclosure
