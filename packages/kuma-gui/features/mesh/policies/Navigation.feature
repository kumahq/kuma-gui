Feature: mesh / policies / navigation

  Background:
    Given the CSS selectors
      | Alias         | Selector                                                                    |
      | row           | [data-testid$='-collection'] tr:first-child                                 |
      | summary-title | [data-testid='slideout-title'] a                                            |
      | action-group  | $row [data-testid='x-action-group-control']                                 |
      | view          | $row [data-testid='x-action-group'] li:first-child [data-testid='x-action'] |
      | action        | $row [data-action]                                                          |
    And the environment
      """
      KUMA_MESHFAULTINJECTION_COUNT: 1
      """

  Rule: In a namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: kubernetes
        """
      And the URL "/meshes/default/meshfaultinjections" responds with
        """
        body:
          items:
          - name: monitor-proxy-0-5064a9c9a-icpsl.kuma-system
            kri: kri_mfi_default__kuma-system_monitor-proxy-0-5064a9c9a-icpsl_
            labels:
              kuma.io/display-name: monitor-proxy-0-5064a9c9a-icpsl
              k8s.kuma.io/namespace: kuma-system
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='policy-detail-view']" element exists

      Examples:
        | URL                                          |
        | /meshes/default/policies/meshfaultinjections |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0-5064a9c9a-icpsl_"
      And the URL doesn't contain "kri_mfi_default__kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0-5064a9c9a-icpsl_/overview"
      And the "[data-testid='policy-detail-view']" element exists

      Examples:
        | URL                                          |
        | /meshes/default/policies/meshfaultinjections |

  Rule: In a non-namespaced environment

    Background:
      Given the environment
        """
        KUMA_ENVIRONMENT: universal
        """
      And the URL "/meshes/default/meshfaultinjections" responds with
        """
        body:
          items:
          - name: monitor-proxy-0
            kri: kri_mfi_default__kuma-system_monitor-proxy-0_
        """

    Scenario Outline: clicking the detail link
      When I visit the "<URL>" URL
      When I click the "$action-group" element
      And I click the "$view" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0_/overview"
      And the "[data-testid='policy-detail-view']" element exists

      Examples:
        | URL                                          |
        | /meshes/default/policies/meshfaultinjections |

    Scenario Outline: clicking the row, opening and summary, and clicking the title
      When I visit the "<URL>" URL
      And I click the "$action" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0_"
      And the URL doesn't contain "kri_mfi_default__kuma-system_monitor-proxy-0_/overview"
      Then I click the "$summary-title" element
      Then the URL contains "kri_mfi_default__kuma-system_monitor-proxy-0_/overview"
      And the "[data-testid='policy-detail-view']" element exists

      Examples:
        | URL                                          |
        | /meshes/default/policies/meshfaultinjections |
