const linkArray = [
  {
    "name": "Mihir Gupta's Personal Website",
    "url" : "https://gmihir.github.io"
  },
  {
    "name": "Mihir Gupta's GitHub Page",
    "url" : "https://github.com/gmihir"
  },
  {
    "name": "Mihir Gupta's LinkedIn Page",
    "url" : "https://www.linkedin.com/in/mihir-gupta-50b299168/"
  }
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
}
