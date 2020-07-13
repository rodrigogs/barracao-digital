const MINUTE = 60 * 1000
const HALF_AN_HOUR = MINUTE * 30

const subscribeUser = ($auth) =>
  $auth.ctx.app.$fireStore
    .collection('facilities')
    .doc($auth.user.cep)
    .collection('doctors')
    .doc($auth.user.username)
    .onSnapshot((doc) => {
      if (!doc.data()) return
      $auth.setUser(doc.data())
    })

const heartbeat = ($auth) =>
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('Heartbeat', Date.now())
    const { username } = $auth.user
    $auth.ctx.app.$api
      .getDoctorByUsername(username)
      .then(() => heartbeat($auth))
  }, HALF_AN_HOUR)

export default function ({ $auth }) {
  heartbeat($auth)

  let userSubscription = null

  if ($auth.loggedIn) {
    userSubscription = subscribeUser($auth)
  }

  $auth.onRedirect((to, from) => {
    if (from === $auth.options.redirect.login && !userSubscription) {
      userSubscription = subscribeUser($auth)
    }

    if (to === $auth.options.redirect.logout && userSubscription) {
      userSubscription()
      userSubscription = null
    }
  })
}
