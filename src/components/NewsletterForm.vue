<template>
  <div class="form-wrapper">
    <KCard title="Get Community Updates">
      <template slot="body">
        <p>
          Sign up for our Kuma community newsletter to get the most recent
          updates and product announcements.
        </p>
        <ValidationObserver
          v-if="formStatus === null || formStatus === false"
          v-slot="{ invalid, passes }"
          class="mt-4"
          tag="form"
          method="post"
          :action="getNewsletterPardotEndpoint"
        >
          <input
            v-for="(key, value) in utmFields"
            :key="key"
            :name="value"
            :value="key"
            type="hidden"
          >
          <input
            type="hidden"
            name="pardot-link"
            :value="formEndpoint"
          >
          <div class="form-controls">
            <div>
              <label
                for="input_email"
                class="sr-only"
              >
                Email
              </label>
              <ValidationProvider
                v-slot="{ errors }"
                name="email"
                rules="required|email"
                class="form-note-wrapper"
              >
                <input
                  id="email"
                  v-model="formFields.email"
                  name="email"
                  type="email"
                  placeholder="Work Email"
                  class="k-input w-100"
                >
                <KAlert
                  v-if="errors.length"
                  size="small"
                  appearance="danger"
                  class="mt-2"
                >
                  <template slot="alertMessage">
                    {{ errors[0] }}
                  </template>
                </KAlert>
              </ValidationProvider>
            </div>
            <div>
              <KButton
                appearance="primary"
                :disabled="invalid"
                type="submit"
                name="submit"
                :class="{ 'is-sending': (invalid === false && formSending === true) }"
                @click="formIsSubmitting()"
              >
                <span v-if="invalid === false && formSending === true">
                  <KIcon
                    icon="spinner"
                    color="rgba(0, 0, 0, 0.1)"
                    size="42"
                  />
                </span>
                <span :class="{ 'is-hidden': (invalid === false && formSending === true) }">
                  Join Newsletter
                </span>
              </KButton>
            </div>
          </div>
        </ValidationObserver>

        <div ref="formMessageMarker" />

        <div
          v-if="formStatus === true"
          class="tip custom-block"
        >
          <p class="custom-block-title">
            Thank you!
          </p>
          <p>You're now signed up for the {{ getSiteData.title }} newsletter.</p>
        </div>

        <div
          v-if="formStatus === false"
          class="danger custom-block"
        >
          <p class="custom-block-title">
            Whoops!
          </p>
          <p>Something went wrong! Please try again later.</p>
        </div>
      </template>
    </KCard>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

// required validation
extend('required', {
  ...required,
  message: 'This field is required.'
})

// email validation
extend('email', {
  ...email,
  message: 'This must be a valid email'
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data () {
    return {
      formFields: {
        email: ''
      },
      formStatus: null,
      formSending: false
    }
  },
  computed: {
    ...mapGetters([
      'getNewsletterPardotEndpoint',
      'getNewsletterPardotEndpointDev'
    ]),
    utmFields () {
      return {
        utm_content: this.$route.query.utm_content || '',
        utm_medium: this.$route.query.utm_medium || '',
        utm_source: this.$route.query.utm_source || '',
        utm_campaign: this.$route.query.utm_campaign || '',
        utm_term: this.$route.query.utm_term || '',
        utm_ad_group: this.$route.query.utm_ad_group || ''
      }
    },
    formDistanceFromTop () {
      const marker = this.$refs.formMessageMarker

      return window.pageYOffset + marker.getBoundingClientRect().top
    },
    formEndpoint () {
      const live = this.getNewsletterPardotEndpoint
      const dev = this.getNewsletterPardotEndpointDev

      if (process.env.NODE_ENV === 'production') {
        return live
      } else {
        return dev
      }
    }
  },
  mounted () {
    this.formBehaviorHandler()
  },
  methods: {
    formBehaviorHandler () {
      const query = this.$route.query.form_success
      const status = query ? JSON.parse(query) : null

      this.formStatus = status

      if (status === false || status === true) {
        window.scrollTo({
          top: this.formDistanceFromTop,
          behavior: 'auto'
        })
      }
    },

    formIsSubmitting () {
      this.formSending = true
    }
  }
}
</script>

<style lang="scss" scoped>
.form-note-wrapper {
  // position: relative;

  .note {
    // position: absolute;
    // top: 100%; left: 0;
    // z-index: 1;
    width: 100%;
  }
}

button.is-sending {
  position: relative;
  // background-color: $green-base !important;
  cursor: not-allowed;

  span:not(.is-hidden) {
    display: block;
    position: absolute;
    left: calc(50% - 12px);
  }
}

.is-hidden {
  opacity: 0;
  visibility: hidden;
}

.form-wrapper .custom-block {
  box-shadow: 0 0 0 1px #cccccc, 0 3px 6px 0 #eaecef;
  padding: 20px;
  text-align: left;
  // border-left: 0;

  // success
  &.tip {
    background-color: #fff;
  }

  // error
  &.danger {

  }

  p {

    &:first-of-type {
      margin-top: 0;
      padding-top: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }
}

@media only screen and (max-width: 840px) {
  .form-controls {

    > div:first-of-type {
      margin-bottom: 10px;
    }
  }
}

@media only screen and (min-width: 841px) {
  .form-controls {
    display: flex;
    // align-items: center;

    > div:first-of-type {
      flex: 1;
      margin-right: 10px;
    }
  }
}
</style>
