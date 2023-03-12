export default function ({app, $auth, redirect, route}) {
  if ($auth && !$auth.loggedIn && route.fullPath.indexOf('/unauthorized') === -1) {
    return redirect(app.localePath('/unauthorized'))
  } else if (route.fullPath.indexOf('/unauthorized') !== -1 && $auth.loggedIn) redirect(app.localePath('/accounts/dashboard'))
}
