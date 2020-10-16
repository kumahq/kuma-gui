import { Machine } from 'xstate'

export default {
  data () {
    return {
      currentMachineState: null
    }
  },

  computed: {
    /**
     * @returns {String} value of the XState State object
     */
    currentState () {
      const initial = this.machine && this.machine.initial

      if (!this.formType || !this.currentMachineState) {
        return (this.currentMachineState && this.currentMachineState.value) || initial
      }

      const currentStateValue = this.currentMachineState &&
        this.currentMachineState.value &&
        this.currentMachineState.value[this.formType]

      return currentStateValue || initial
    }
  },

  methods: {
    transition (action, state) {
      this.currentMachineState = this.machine.transition(this.currentMachineState, action)

      for (const key in state) {
        this.$data[key] = state[key]
      }
    },

    fetchMachine (id) {
      return Machine({
        id,
        initial: 'idle',
        states: {
          idle: { on: { FETCH: 'pending', REJECT: 'error' } },
          pending: { on: { RESOLVE: 'success', REJECT: 'error' } },
          success: { type: 'final' },
          error: { on: { FETCH: 'pending' } }
        }
      })
    }
  }
}
