/**
 * SerializeInput
 *
 * Strips all non-alphaneumeric characters from a string that are entered
 * into an input, converts spaces into dashes, and converts to lowercase.
 *
 */

export default {
  bind (el: HTMLInputElement) {
    el.oninput = (e) => {
      const re1 = new RegExp(/[^a-zA-Z0-9 -]/g)
      const re2 = new RegExp(/\s+/g)
      const re3 = new RegExp(/-+/g);

      // this will clean up the input value
      // immediately as the user types
      (<HTMLInputElement>e.target).value = (<HTMLInputElement>e.target).value
        .replace(re1, '')
        .replace(re2, '-')
        .replace(re3, '-')
        .trim()
    }
  }
}
