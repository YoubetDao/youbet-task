const CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID

export const getRedirectUri = () => {
  const href = window.location.href
  return `${location.origin}/auth/github/callback?redirect_uri=${encodeURIComponent(href)}`
}

export const githubOAuthUri = () => {
  return `http://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${getRedirectUri()}&response_type=code&scope=user:email,repo`
}

export const githubOAuthContentUri = () => {
  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${getRedirectUri()}&response_type=code&scope=user:email,repo&prompt=consent`
}
