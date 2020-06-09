export default function (ctx) {
  if (!(ctx.$auth.$state.user.admin || ctx.$auth.$state.user.master)) {
    return ctx.redirect(ctx.base)
  }
}
