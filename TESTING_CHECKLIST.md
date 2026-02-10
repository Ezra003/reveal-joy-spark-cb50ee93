# Testing Checklist

## Functional Testing

### Setup Screen
- [ ] Can select gender (boy/girl)
- [ ] Can enter baby name (optional)
- [ ] Can enter due date (optional)
- [ ] Can toggle voting on/off
- [ ] Validation works for all inputs
- [ ] Character limits enforced
- [ ] Continue button disabled until gender selected
- [ ] Transitions smoothly to next screen

### Voting Screen
- [ ] Share link copies to clipboard
- [ ] QR code generates correctly
- [ ] Vote buttons work
- [ ] Double voting prevented
- [ ] Vote counts update in real-time
- [ ] Progress bar animates smoothly
- [ ] Percentages calculate correctly
- [ ] Host can start countdown
- [ ] Guests see waiting message
- [ ] Pull to refresh works on mobile

### Countdown Screen
- [ ] Countdown starts at 3
- [ ] Decrements every second
- [ ] Background matches gender
- [ ] Haptic feedback works
- [ ] Sound plays (if enabled)
- [ ] Transitions to reveal at 0

### Reveal Screen
- [ ] Correct gender displayed
- [ ] Baby name shown (if provided)
- [ ] Due date shown (if provided)
- [ ] Confetti animation plays
- [ ] Emoji rain effect works
- [ ] Vote results displayed
- [ ] Share functionality works
- [ ] Download/print works
- [ ] Reset confirms before clearing
- [ ] Sound toggle works

## Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet Portrait (768x1024)
- [ ] Tablet Landscape (1024x768)
- [ ] Mobile Large (414x896)
- [ ] Mobile Medium (375x812)
- [ ] Mobile Small (320x568)

## Performance Testing

- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No memory leaks
- [ ] Smooth animations (60fps)
- [ ] Bundle size < 500KB gzipped
- [ ] Images optimized
- [ ] Lazy loading works

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] Form labels properly associated
- [ ] Error messages announced
- [ ] Reduced motion respected

## Edge Cases

- [ ] No internet connection
- [ ] Slow 3G connection
- [ ] localStorage quota exceeded
- [ ] Invalid URL parameters
- [ ] Very long names (50+ chars)
- [ ] Special characters in names
- [ ] Rapid clicking/voting
- [ ] Browser back button
- [ ] Refresh during countdown
- [ ] Multiple tabs open

## Security Testing

- [ ] XSS attempts blocked
- [ ] SQL injection prevented
- [ ] CSRF protection active
- [ ] Input sanitization works
- [ ] Output encoding correct
- [ ] Headers properly set
- [ ] HTTPS enforced
- [ ] No sensitive data in URLs

## Mobile-Specific

- [ ] Touch gestures work
- [ ] Swipe navigation smooth
- [ ] Pull to refresh functional
- [ ] Haptic feedback works
- [ ] No zoom on input focus
- [ ] Safe area insets respected
- [ ] Orientation change handled
- [ ] PWA installable
- [ ] Offline mode works
- [ ] Share sheet works
