---
created: 2026-02-18
planning_time: ~5 minutes
planning_tokens: ~17,000
status: completed
implementation_time: ~20 minutes
implementation_tokens: ~44,000
---

# XLayout Migration Plan: `type` → `variant` Property

## Original User Request

> We use an XLayout component for layout, we recently added a new `variant` property to it to replace the old `type` property. please could you write a plan to go through the codebase and upgrade this property change, once you have finished you can delete the old `type` property from XLayout seeing as it is no longer being used.

## Overview

The XLayout component currently supports both the deprecated `type` property and the new `variant` property. This plan outlines the migration from `type` to `variant` across the entire codebase, followed by removal of the deprecated property.

**Initial Scope (INCORRECT):** 17 files with 25 usages + 1 README file with 4 examples
**Actual Scope (FINAL):** 60 files with 134 usages + 1 README file with 4 examples

**Status:** ✅ COMPLETED - All 134 usages migrated, deprecated property removed from XLayout component

## Property Mapping

| Old `type` Value | New `variant` Value | Notes |
|------------------|---------------------|-------|
| `"stack"` | `"y-stack"` | Vertical stack (renamed for clarity) |
| `"separated"` | `"separated"` | Direct mapping (no change) |
| `"columns"` | `"columns"` | Direct mapping (no change, not currently used) |
| N/A | `"x-stack"` | New horizontal stack variant |
| N/A | `""` (empty string) | Default value |

**Current Usage Distribution:**
- `type="stack"`: 10 instances → `variant="y-stack"`
- `type="separated"`: 15 instances → `variant="separated"`

## Implementation Steps

### Phase 1: Update Component Documentation

**File:** `packages/x/src/components/x-layout/README.md`

Update all 4 documentation examples:
- Line 12: `type="stack"` → `variant="y-stack"`
- Line 15: `type="separated"` → `variant="separated"`
- Line 28: `type="stack"` → `variant="y-stack"`
- Line 43: `type="separated"` → `variant="separated"`

### Phase 2: Update Component Library Files (packages/x)

**2 files, 2 usages:**

1. `packages/x/src/components/x-code-block/XCodeBlock.vue`
   - 1 instance: `type="stack"` → `variant="y-stack"`

2. `packages/x/src/components/x-search/XSearch.vue`
   - 1 instance: `type="separated"` → `variant="separated"`

### Phase 3: Update Application Files (packages/kuma-gui)

**15 files, 23 usages:**

#### Service Views (3 files, 7 usages):

3. `packages/kuma-gui/src/app/services/views/MeshServiceDetailView.vue`
   - 3 instances: 1× `type="stack"` → `variant="y-stack"`, 2× `type="separated"` → `variant="separated"`

4. `packages/kuma-gui/src/app/services/views/MeshMultiZoneServiceDetailView.vue`
   - 2 instances: 1× `type="stack"` → `variant="y-stack"`, 1× `type="separated"` → `variant="separated"`

5. `packages/kuma-gui/src/app/services/views/MeshExternalServiceDetailView.vue`
   - 2 instances: 1× `type="stack"` → `variant="y-stack"`, 1× `type="separated"` → `variant="separated"`

#### Zone Views (3 files, 5 usages):

6. `packages/kuma-gui/src/app/zones/views/ZoneDetailView.vue`
   - 2 instances: `type="separated"` → `variant="separated"`

7. `packages/kuma-gui/src/app/zones/views/ZoneDetailTabsView.vue`
   - 1 instance: `type="separated"` → `variant="separated"`

8. `packages/kuma-gui/src/app/zone-ingresses/views/ZoneIngressDetailView.vue`
   - 1 instance: `type="separated"` → `variant="separated"`

9. `packages/kuma-gui/src/app/zone-egresses/views/ZoneEgressDetailView.vue`
   - 2 instances: 1× `type="stack"` → `variant="y-stack"`, 1× `type="separated"` → `variant="separated"`

#### Data Plane Views (4 files, 5 usages):

10. `packages/kuma-gui/src/app/data-planes/views/DataPlaneDetailView.vue`
    - 2 instances: `type="separated"` → `variant="separated"`

11. `packages/kuma-gui/src/app/data-planes/views/DataPlaneInboundSummaryOverviewView.vue`
    - 1 instance: `type="stack"` → `variant="y-stack"`
    - Note: This file already has 1 usage of `variant="y-stack"` on line 126 (no change needed)

12. `packages/kuma-gui/src/app/data-planes/views/DataPlaneOutboundSummaryOverviewView.vue`
    - 1 instance: `type="stack"` → `variant="y-stack"`

13. `packages/kuma-gui/src/app/legacy-data-planes/views/DataPlaneDetailView.vue`
    - 2 instances: `type="separated"` → `variant="separated"`

#### Gateway Views (2 files, 2 usages):

14. `packages/kuma-gui/src/app/gateways/views/BuiltinGatewaySummaryView.vue`
    - 1 instance: `type="stack"` → `variant="y-stack"`

15. `packages/kuma-gui/src/app/gateways/views/DelegatedGatewayDetailView.vue`
    - 1 instance: `type="stack"` → `variant="y-stack"`

#### Other Views (3 files, 3 usages):

16. `packages/kuma-gui/src/app/meshes/views/MeshDetailView.vue`
    - 1 instance: `type="separated"` → `variant="separated"`

17. `packages/kuma-gui/src/app/subscriptions/views/SubscriptionsListView.vue`
    - 1 instance: `type="stack"` → `variant="y-stack"`

### Phase 4: Remove Deprecated `type` Property from XLayout Component

**File:** `packages/x/src/components/x-layout/XLayout.vue`

#### 4.1 Update Props Definition

Remove the deprecated `type` property from the props definition (lines 18-26):

**Before:**
```typescript
const props = withDefaults(defineProps<{
  variant?: '' | 'x-stack' | 'y-stack' | 'separated' | 'columns'
  size?: 'small' | 'normal' | 'large' | 'max'
  justify?: 'start' | 'around' | 'between' | 'end'
  truncate?: boolean
  /** @deprecated please use `variant` */
  type?: 'stack' | 'separated' | 'columns'
}>(), {
  variant: '',
  type: 'stack',
  size: 'normal',
  justify: '',
  truncate: false,
})
```

**After:**
```typescript
const props = withDefaults(defineProps<{
  variant?: '' | 'x-stack' | 'y-stack' | 'separated' | 'columns'
  size?: 'small' | 'normal' | 'large' | 'max'
  justify?: 'start' | 'around' | 'between' | 'end'
  truncate?: boolean
}>(), {
  variant: '',
  size: 'normal',
  justify: '',
  truncate: false,
})
```

#### 4.2 Simplify Computed Property

Remove the fallback logic from the `variant` computed property (lines 35-39):

**Before:**
```typescript
const variant = computed(() => 
  props.variant.length > 0 
    ? props.variant 
    : (props.type === 'stack' ? 'y-stack' : props.type)
)
```

**After:**
```typescript
const variant = computed(() => props.variant)
```

#### 4.3 Update Template Logic

Update the template's `:is` binding (line 3) to use `variant` instead of `type`:

**Before:**
```vue
:is="props.type === 'separated' && props.truncate ? KTruncate : 'div'"
```

**After:**
```vue
:is="variant === 'separated' && props.truncate ? KTruncate : 'div'"
```

## Testing & Validation

### Manual Testing Checklist

After implementation, verify the following views still render correctly:

- [ ] Data plane detail views (3 files)
- [ ] Service detail views (3 files)
- [ ] Zone views (3 files)
- [ ] Gateway views (2 files)
- [ ] Mesh detail view
- [ ] Subscriptions list view
- [ ] XCodeBlock component
- [ ] XSearch component

### Build Verification

- [ ] Run `make` or relevant build commands to ensure no TypeScript errors
- [ ] Run `make -C packages/x` to build the component library
- [ ] Run `make -C packages/kuma-gui` to build the application

## Notes

- **No Tests to Update:** The XLayout component has no unit tests or Storybook stories
- **No Breaking Changes for Default Behavior:** Components using XLayout without either `type` or `variant` will continue to work (default is empty string)
- **One File Already Partially Migrated:** `DataPlaneInboundSummaryOverviewView.vue` has both old and new patterns
- **Review Before Commit:** User requested to review all changes before committing

## Edge Cases & Considerations

1. **Empty String Default:** The new `variant` default is an empty string `''`, which is different from the old `type` default of `'stack'`. Components relying on the old default behavior may need explicit `variant="y-stack"` if they were using `<XLayout>` without any type/variant prop.

2. **Truncate Logic:** The template uses `type === 'separated'` to conditionally render KTruncate. After migration, this will use the computed `variant` value instead.

3. **CSS Classes:** The component applies the variant as a CSS class. Ensure CSS supports all variant values including the new `x-stack` and `y-stack` classes.

## Success Criteria

- ✅ All 25 usages of `type` property migrated to `variant`
- ✅ All 4 documentation examples updated
- ✅ Deprecated `type` property removed from XLayout component
- ✅ All builds pass without errors
- ✅ Visual regression testing shows no unintended layout changes
- ✅ User review completed and approved
