# Xbadge

A KBadge that doesn't automatically truncate.

The vast majority of the time we don't want these to truncate. We either use
them for 'small thing' like ports, or we use them with tags/labels which we
generally put within a `XTruncate` (and when we don't we don't want them
truncated!)

XBadge doesn't truncate by default, but has all the same properties as a
KBadge, so you can set it to truncate if you need to.

<Story height="320">
  <div>
    <XBadge>
      Thing
    </XBadge>

  </div>
  <div>
    <XBadge>
      This is a XBadge that doesn't automatically truncate
    </XBadge>
  </div>
  <div>
    <KBadge>
      This is a KBadge that does automatically truncate
    </KBadge>
  </div>
  <div>
    <XBadge
      max-width="200px"
    >
      This is a 200px XBadge that does automatically truncate
    </XBadge>
  </div>
</Story>
