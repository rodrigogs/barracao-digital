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

export default function({ $auth }) {
  let userSubscription = null

  if ($auth.loggedIn) {
    userSubscription = subscribeUser($auth)
  }

  $auth.onRedirect((to, from) => {
    if (from === '/login' && !userSubscription) {
      userSubscription = subscribeUser($auth)
    }

    if (to === '/' && userSubscription) {
      userSubscription()
      userSubscription = null
    }
  })
}
