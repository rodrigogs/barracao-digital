export default function(ctx) {
  if (ctx.$auth.$state.loggedIn) {
    return ctx.redirect(ctx.base)
  }
}
