const { GITHUB_REPOSITORY: repository, GITHUB_SHA: sha, GITHUB_TOKEN: token } = process.env
if (!repository || !sha || !token) throw new Error('GitHub repository, SHA, and token are required')
const url = new URL(`https://api.github.com/repos/${repository}/actions/workflows/ci.yml/runs`)
url.searchParams.set('head_sha', sha)
url.searchParams.set('status', 'completed')
url.searchParams.set('per_page', '100')
const response = await fetch(url, {
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
})
if (!response.ok) throw new Error(`Could not inspect CI runs: GitHub returned ${response.status}`)
const body = await response.json()
const successful = body.workflow_runs?.find(run => run.head_sha === sha && run.conclusion === 'success')
if (!successful) throw new Error(`No successful ci.yml run exists for ${sha}`)
console.log(`Verified successful CI run ${successful.html_url} for ${sha}.`)
