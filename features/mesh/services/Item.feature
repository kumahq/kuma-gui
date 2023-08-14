Feature: mesh / services / item
  Background:
    Given the CSS selectors
      | Alias                  | Selector                                                                          |
      | data-plane-proxies-tab | #dataPlaneProxies-tab                                                             |
      | item                   | [data-testid='data-plane-collection'] tbody tr                                    |
      | input-search           | [data-testid='k-filter-bar-filter-input']                                         |
      | button-search          | [data-testid='k-filter-bar-submit-query-button']                                  |
      | button-clear-search    | [data-testid="k-filter-bar-clear-query-button"]                                   |
      | button-actions         | $item:nth-child(1) .actions-column .dropdown-trigger button                       |
      | button-view            | $item:nth-child(1) .actions-column [data-testid="k-dropdown-item-View-details"] a |

  Rule: With an external service
    Background:
      Given the URL "/meshes/default/service-insights/firewall-1" responds with
        """
        body:
          serviceType: "external"
        """
      When I visit the "/mesh/default/service/firewall-1" URL

    Scenario: External services don't display the dataplane list
      Then the "$data-plane-proxies-tab" element doesn't exist

  Rule: With an internal service
    Background:
      Given the URL "/meshes/default/service-insights/system-1" responds with
        """
        body:
          serviceType: "internal"
        """
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
          body:
            items:
              - name: fake-dataplane
                dataplane:
                  networking:
                    gateway: ~
        """
      When I visit the "/mesh/default/service/system-1" URL

    Scenario: Internal services request the dataplanes for the service
      When I click the "$data-plane-proxies-tab" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          tag: "kuma.io/service:system-1"
          offset: 0
          size: 50
        """

    Scenario: Searching by tag doesn't overwrite the existing service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "[data-testid='k-filter-bar-filter-input']" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:version" into the "$input-search" element
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
            - "version"
          offset: 0
          size: 50
        """

    Scenario: Searching by service tag doesn't overwrite the existing service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:kuma.io/service:panel-2" into the "$input-search" element
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes+insights" wasn't requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:panel-2"
        """

    Scenario: The clear search button sends a new request with no search params
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/service:system-1"
            - "kuma.io/protocol:tcp"
          offset: 0
          size: 50
        """
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes+insights" wasn't requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/protocol:tcp"
        """

    Scenario: The clear search button sends a new request with the correct service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/service:system-1"
            - "kuma.io/protocol:tcp"
          offset: 0
          size: 50
        """
      And the URL "/meshes/default/dataplanes+insights" responds with
        """
        """
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes+insights" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
        """

    Scenario: Clicking an item takes you to the correct page
      When I click the "$data-plane-proxies-tab" element
      Then the "$item:nth-child(1) td:nth-child(1) a" element contains "fake-dataplane"
      And I click the "$item:nth-child(1) td:nth-child(1) a" element
      Then the URL contains "/mesh/default/data-plane/fake-dataplane"

    Scenario: Clicking an items view menu takes you to the correct page
      When I click the "$data-plane-proxies-tab" element
      Then the "$item:nth-child(1) td:nth-child(1) a" element contains "fake-dataplane"
      And I click the "$button-actions" element
      Then I click the "$button-view" element
      Then the URL contains "/mesh/default/data-plane/fake-dataplane"
