import Url from 'url-parse'


export default (req, res, next) => {
  const url = new Url(req.url)

  /**
   * Uppercase characters in URLs should force redirect to the lowercase versions.
   */
  if (url.pathname.match(/[A-Z]/)) {
    url.set('pathname', url.pathname.toLowerCase())
    redirect(res, url.href)
    return
  }

  /**
   * Trailing slash version of the URL should force redirect to non-trailing slash version of the URL.
   */
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.set('pathname', url.pathname.slice(0, -1))
    redirect(res, url.href)
    return
  }

  next()
}

/**
 * Redirect function to 301 status
 */
function redirect(res, location) {
  res.writeHead(301, {
    location
  })
  res.end()
}
