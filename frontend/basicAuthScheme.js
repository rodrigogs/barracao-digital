export default class BasicAuthScheme {
  constructor(auth, options) {
    this.$auth = auth
    this.name = options._name

    this.options = Object.assign({}, DEFAULTS, options)
  }

  _setToken(token) {
    if (this.options.globalToken) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
    }
  }

  _clearToken() {
    if (this.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
    }
  }

  mounted() {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
    }

    return this.$auth.fetchUserOnce()
  }

  async login(endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    const { response } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    const args = arguments[0]
    const encodedToken = btoa(`${args.data.username}:${args.data.password}`)

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + encodedToken
        : encodedToken

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }

    if (this.options.autoFetchUser) {
      this.$auth.setUser(response.data)
    }

    return response
  }

  async setUserToken(tokenValue) {
    const token = this.options.tokenType
      ? this.options.tokenType + ' ' + tokenValue
      : tokenValue
    this.$auth.setToken(this.name, token)
    this._setToken(token)

    return this.fetchUser()
  }

  async fetchUser(endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    const [username, password] = atob(
      this.$auth.getToken(this.name).split(' ')[1]
    ).split(':')

    const { data } = await this.$auth.loginWith(this.name, {
      data: {
        username,
        password
      }
    })

    this.$auth.setUser(data)
  }

  async logout(endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {})
    }

    // But reset regardless
    return this.$auth.reset()
  }

  async reset() {
    if (this.options.tokenRequired) {
      this._clearToken()
    }

    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
    this.$auth.setRefreshToken(this.name, false)

    return Promise.resolve()
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Basic',
  globalToken: true,
  tokenName: 'Authorization',
  autoFetchUser: true
}
