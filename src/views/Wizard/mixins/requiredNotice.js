export default {
  methods: {
    requiredNotice (ev) {
      const input = ev.target
      const val = input.value
      const newClass = `required--${input.id}`
      const notice = document.createElement('p')
      const content = document.createTextNode('This field is required to continue!')

      notice.classList.add(newClass)
      notice.appendChild(content)

      if (!val) {
        input.parentNode.insertBefore(notice, input.nextSibling)
      }
    }
  }
}
