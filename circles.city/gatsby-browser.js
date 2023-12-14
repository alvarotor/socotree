/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

exports.onServiceWorkerUpdateFound = () => {
  if (
    window.confirm(
      "This site has been updated with new data. Do you wish to reload the site to get the new data?"
    )
  ) {
    window.location.reload(true)
  }
}

// exports.onClientEntry = () => {
//   window.onload = () => {
//     if (window.location.hash) {
//       const hash = window.location.hash.substring(1)
//       if (hash === "faq") {
//         const button = document.getElementById(hash)
//         alert(button)
//         // if (button) {
//         //   button.click()
//         // }
//       }
//     }
//   }
// }
