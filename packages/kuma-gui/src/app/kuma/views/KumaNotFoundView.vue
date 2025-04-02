<template>
  <RouteView
    name="kuma-not-found-view"
  >
    <AppView>
      <div
        class="overview"
      >
        <XEmptyState>
          <template
            #icon
          >
            <XIcon
              name="warning"
              class="mb-3"
            />
          </template>

          <template
            #title
          >
            <h1>
              <RouteTitle
                title="Page Not Found"
              />
            </h1>
          </template>

          <p>The page or entity you were looking for does not exist.</p>

          <template
            #action
          >
            <XAction
              appearance="primary"
              :to="{ name: 'home' }"
            >
              Go Home
            </XAction>
          </template>
        </XEmptyState>
      </div>
    </AppView>
  </RouteView>
</template>
