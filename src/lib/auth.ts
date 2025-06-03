const CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID

export const getRedirectUri = () => {
  const location = window.location
  const searchParams = new URLSearchParams(location.search)
  const redirectUri = searchParams.get('redirect_uri') || '/'
  const url = `${location.origin}/auth/github/callback?redirect_uri=${encodeURIComponent(redirectUri)}`
  return url
}

export const githubOAuthUri = () => {
  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${getRedirectUri()}&response_type=code&scope=user:email,public_repo,read:org`
}

export const githubOAuthContentUri = () => {
  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${getRedirectUri()}&response_type=code&scope=user:email,public_repo,read:org,admin:repo_hook&prompt=consent`
}
