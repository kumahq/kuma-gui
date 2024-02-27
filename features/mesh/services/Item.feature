Feature: mesh / services / item
  Background:
    Given the CSS selectors
      | Alias               | Selector                                         |
      | dataplanes          | [data-testid='data-plane-collection']            |
      | config              | [data-testid='external-service-config']          |
      | item                | $dataplanes tbody tr                             |
      | input-search        | [data-testid='k-filter-bar-filter-input']        |
      | button-search       | [data-testid='k-filter-bar-submit-query-button'] |
      | button-clear-search | [data-testid="k-filter-bar-clear-query-button"]  |

  Scenario Outline: Shows correct tabs for service type <ServiceType>
    Given the URL "/meshes/default/service-insights/firewall-1" responds with
      """
        body:
          serviceType: <ServiceType>
      """

    When I visit the "/meshes/default/services/internal/firewall-1/overview" URL
    Then the "$dataplanes" element exists
    Then the "$config" element doesn't exist

    Examples:
      | ServiceType    |
      | !!js/undefined |
      | internal       |

  Rule: With an internal service
    Background:
      Given the URL "/meshes/default/service-insights/system-1" responds with
        """
        body:
          serviceType: "internal"
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
          body:
            items:
              - name: fake-dataplane
                dataplane:
                  networking:
                    gateway: !!js/undefined
        """
      When I visit the "/meshes/default/services/internal/system-1/overview" URL

    Scenario: Internal services request the dataplanes for the service
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag: "kuma.io/service:system-1"
          offset: 0
          size: 50
        """

    Scenario: Searching by tag doesn't overwrite the existing service tag
      Then the "[data-testid='k-filter-bar-filter-input']" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:version" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
            - "version"
          offset: 0
          size: 50
        """

    Scenario: Searching by service tag doesn't overwrite the existing service tag
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:kuma.io/service:panel-2" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" wasn't requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:panel-2"
        """

    Scenario: The clear search button sends a new request with no search params
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes/_overview" wasn't requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/protocol:tcp"
        """
      And the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
        """

    Scenario: The clear search button sends a new request with the correct service tag
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/service:system-1"
            - "kuma.io/protocol:tcp"
          offset: 0
          size: 50
        """
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
        """

    Scenario: Clicking an items view menu takes you to the correct page
      Then the "$item:nth-child(1) td:nth-child(1) a" element contains "fake-dataplane"
      And I click the "$item:nth-child(1) [data-testid='details-link']" element
      Then the URL contains "/meshes/default/data-planes/fake-dataplane/overview"
