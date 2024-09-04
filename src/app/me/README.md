---
section: Packages
---
# me

Module/package for interacting with (i.e. reading and saving) user profile
data.

We use this module for saving things like general user UI preferences such as
table column widths.

All access to `me` should use `DataSource`/`DataLoader` and `me` provides a set
of overrideable `sources` meaning that whilst we use localStorage for storage,
it's easy to switch the localStorage backing for something else if required.

