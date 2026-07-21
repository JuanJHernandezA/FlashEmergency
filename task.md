Read rules.md and inspect the Dashboard layout, especially the Emergency Map and Nearby Places sections.

Fix the mobile layout proportions.

The current problem is that:

- The map occupies too much vertical space on mobile.
- The Nearby Places section also occupies too much space.
- The Dashboard feels too long and requires excessive scrolling.

Do not modify business logic, API calls, filtering or map functionality.

---

## Mobile Map

On small screens:

- Reduce the map height.
- Use a compact but usable responsive height.
- Avoid using excessive `min-height` or fixed heights that make the map dominate the screen.
- Ensure map controls remain visible.
- Keep the map usable for selecting locations and markers.

The map should feel like a compact section of the Dashboard, not the entire page.

Use responsive Tailwind classes.

Example approach:

- Mobile: compact map height.
- Tablet: medium map height.
- Desktop: larger map height.

Do not use the same large height on every screen size.

---

## Nearby Places

Reduce the vertical space used by the Nearby Places section on mobile.

Ensure:

- Cards are compact.
- Cards do not have excessive padding.
- Avoid unnecessarily large fixed heights.
- Avoid excessive gaps between cards.
- Keep important information visible.
- Keep Get Directions accessible.

On mobile, nearby places should use a compact single-column layout.

On tablet and desktop, use responsive columns when appropriate.

---

## Dashboard Spacing

Review the spacing between:

- Current Location.
- Emergency Number.
- Map.
- Nearby Places.

Reduce excessive:

- `padding`
- `margin`
- `gap`
- fixed heights
- empty space

Only on small screens where appropriate.

Keep the desktop design comfortable and spacious.

---

## Responsive Behavior

Use a mobile-first approach.

Suggested behavior:

Mobile:
- Compact map.
- Compact cards.
- Reduced spacing.
- Single-column layout.

Tablet:
- Medium map.
- Balanced spacing.
- Responsive grid.

Desktop:
- Larger map.
- Multi-column layout where appropriate.
- Comfortable spacing.

---

## Important

Do not redesign the entire Dashboard.

Do not remove existing functionality.

Do not change the map behavior.

Do not change the nearby places filtering.

Only improve the responsive proportions and vertical space usage.

Use Tailwind CSS responsive utilities.

Keep the project compiling.

Inspect all fixed heights such as h-[500px], min-h-screen, large padding and excessive gaps in the Dashboard.

Replace them with responsive values appropriate for mobile, tablet and desktop.

Do not blindly apply min-h-screen to sections that should only occupy their content height.