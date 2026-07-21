Read `rules.md` and inspect the entire FlashEmergency project.

Perform a complete responsive design audit and fix the existing UI.

The application currently has significant responsive issues.

Do not create new features.

Do not change the business logic.

Focus only on responsive design, layout, spacing, sizing and usability across different screen sizes.

---

# Responsive Audit

Inspect every page and component, including:

- Dashboard.
- Emergency Map.
- AI Assistant.
- Guided AI flow.
- Emergency Reports.
- Emergency Contacts.
- History.
- Accessibility Settings.
- Medical Profile if implemented.
- QR Emergency Card if implemented.
- Navigation.
- Bottom navigation.
- Modals.
- Dialogs.
- Forms.
- Cards.
- Maps.
- Emergency buttons.
- Empty states.
- Loading states.
- Error states.

---

# Screen Sizes

Ensure the application works correctly on:

- Small mobile phones: 320px - 375px.
- Standard mobile phones: 390px - 430px.
- Tablets.
- Small laptops.
- Desktop screens.
- Large desktop screens.

---

# Mobile Requirements

On mobile:

- Prevent horizontal overflow.
- Avoid content being cut off.
- Avoid buttons going outside the viewport.
- Use appropriate horizontal padding.
- Ensure text wraps correctly.
- Make touch targets large enough.
- Prevent cards from becoming too wide.
- Ensure forms fit the screen.
- Ensure modals fit the viewport.
- Ensure maps have an appropriate height.
- Ensure emergency actions are easy to reach.
- Ensure the bottom navigation does not cover page content.

---

# Dashboard

Review the entire Dashboard.

Fix:

- Card layout.
- Emergency button sizing.
- Current location section.
- Coordinates.
- Emergency services.
- Map size.
- Statistics.
- Spacing.
- Text wrapping.
- Responsive grid behavior.

The dashboard must work correctly in both:

- Single-column mobile layout.
- Multi-column tablet and desktop layout.

---

# Bottom Navigation

Audit the bottom navigation.

Ensure:

- It stays inside the viewport.
- It does not overlap content.
- It does not cover buttons or forms.
- It works on small screens.
- Icons and labels are readable.
- Touch targets are accessible.
- Active state is clearly visible.
- Safe area padding is supported for mobile devices.

Use appropriate bottom padding on pages so content is never hidden behind the navigation.

---

# Navigation and Header

Ensure:

- The header adapts to small screens.
- Long titles do not overflow.
- Buttons do not collide.
- Menus fit within the viewport.
- Accessibility controls remain usable.
- Theme and language controls remain accessible.

---

# AI Assistant

Review the chat interface on mobile.

Ensure:

- Messages wrap correctly.
- Long messages do not overflow.
- The input does not get hidden by bottom navigation.
- Quick action buttons wrap correctly.
- Guided AI buttons fit small screens.
- The keyboard does not make the input unusable.
- The send button remains accessible.

---

# Emergency Map

Ensure:

- The map has an appropriate responsive height.
- Controls do not overlap.
- Emergency service cards fit the viewport.
- Get Directions buttons are fully visible.
- Text has sufficient contrast.
- Cards stack correctly on mobile.

---

# Emergency Reports

Ensure:

- Forms fit small screens.
- Photo upload areas are responsive.
- Image previews do not overflow.
- Buttons stack when necessary.
- Share and Send to Emergency Contact buttons remain visible.
- Report details are readable on mobile.

---

# History

Ensure:

- AI conversations fit small screens.
- Emergency reports fit small screens.
- Long descriptions wrap correctly.
- Cards do not overflow.
- Detail pages are responsive.

---

# Accessibility

Verify responsive behavior for:

- Font size increase.
- Dark mode.
- Light mode.
- Language switching.
- Screen reading controls.

The interface must remain usable when the font size is increased.

---

# Tailwind Requirements

Use responsive Tailwind CSS utilities.

Prefer:

- Mobile-first styles.
- `sm:`
- `md:`
- `lg:`
- `xl:`

Avoid:

- Fixed widths that cause overflow.
- Hardcoded viewport-breaking dimensions.
- Excessive absolute positioning.
- Negative margins that break mobile layouts.
- Fixed heights for dynamic content.
- Desktop-first layouts.

Use:

- `w-full`
- `max-w-*`
- `min-w-0`
- `flex-wrap`
- Responsive grids.
- Responsive padding.
- Responsive gaps.
- `overflow-hidden` only when appropriate.

---

# Final Validation

After making changes:

1. Check every route.
2. Check every main component.
3. Check mobile layout.
4. Check tablet layout.
5. Check desktop layout.
6. Check light mode.
7. Check dark mode.
8. Check increased font size.
9. Check bottom navigation.
10. Check horizontal overflow.

The application must not have:

- Horizontal scrolling caused by layout bugs.
- Cut-off text.
- Buttons outside the viewport.
- Cards overflowing.
- Content hidden behind bottom navigation.
- Broken mobile layouts.

Do not modify business logic.

Do not add new features.

Do not add unnecessary dependencies.

Use the existing architecture and design system.

Keep the project compiling.