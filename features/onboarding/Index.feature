Feature: onboarding / index
  Background:
    Given the CSS selectors
      | Alias                   | Selector                                |
      | skip-button             | [data-testid='onboarding-skip-button']  |
      | environment-text        | [data-testid='kuma-environment']        |
      | onboarding-notification | [data-testid='onboarding-notification'] |

  Scenario: Visiting the homepage with a fresh install shows the onboarding notification
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 0
      KUMA_MESH_COUNT: 1
      """
    When I visit the "/" URL
    Then the "$onboarding-notification" element exists

  Scenario: Visiting the homepage with a dataplane in the default mesh doesn't show the onboarding notification
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 1
      KUMA_MESH_COUNT: 1
      """
    When I visit the "/" URL
    Then the "$onboarding-notification" element doesn't exist

  Scenario: Visiting the a non-home route with a fresh install doesn't show the onboarding notification
    Given the environment
      """
      KUMA_DATAPLANE_COUNT: 0
      KUMA_MESH_COUNT: 1
      """
    When I visit the "/meshes" URL
    Then the "$onboarding-notification" element doesn't exist

  Scenario: Visiting onboarding redirects to welcome
    When I visit the "/onboarding" URL
    Then the URL is "/onboarding/welcome"

  Scenario Outline: The onboarding "<URL>" page skip button works
    When I visit the "<URL>" URL
    Then I click the "$skip-button" element
    Then the URL is "/"
    Examples:
      | URL                 |
      | /onboarding/welcome |
      | /onboarding/deployment-types |
      | /onboarding/configuration-types |
      | /onboarding/multi-zone |
      | /onboarding/create-mesh |
      | /onboarding/add-services |
      | /onboarding/add-services-code |
      | /onboarding/dataplanes-overview |

