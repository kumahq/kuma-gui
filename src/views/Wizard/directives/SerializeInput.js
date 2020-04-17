/**
 * SerializeInput
 *
 * Strips all non-alphaneumeric characters from a string that are entered
 * into an input, converts spaces into dashes, and converts to lowercase.
 *
 */

export default {
  bind (el) {
    el.oninput = (e) => {
      const regex1 = new RegExp(/[^a-zA-Z0-9 -]/g)
      const regex2 = new RegExp(/ /g)

      // this will clean up the input value
      // immediately as the user types
      e.target.value = e.target.value
        .replace(regex1, '')
        .replace(regex2, '-')
        .toLowerCase()
    }
  }
}
