# Flutter platform

Load when `pubspec.yaml` shows a Flutter app: mapping tokens in `direct`, building screens in `build`,
or capturing and checking in `review`. Covers Material 3 and Cupertino, theming, adaptive layout, insets,
gestures, text scaling, accessibility, motion, navigation and verification. Flutter only; the web lives in `web.md`.

## Material 3 and Cupertino

| Situation | Choice |
|---|---|
| Default for a cross-platform app | One Material 3 theme that carries the brand on both platforms, with each platform's conventions respected (table below). |
| The brief asks for an iOS-native feel, or the product is iOS-first | Cupertino widgets on iOS (`CupertinoApp` or Cupertino widgets inside a `MaterialApp`). This means two widget trees for shell and controls; record the cost in `DESIGN.md`. |
| An existing app already uses one set | Follow it. Do not mix sets screen by screen. |

Never carry one platform's idiom to the other: no iOS-style action sheet on Android, no Material drawer as the main iOS navigation.

| Convention | Android | iOS | In Flutter |
|---|---|---|---|
| Back | System back gesture or button, with predictive back | Swipe from the leading edge; back control at the top with the previous title | Use real routes so both work. Never place a custom horizontal gesture on the leading edge. Intercept back with `PopScope` only to protect unsaved input. |
| Top-level navigation | Bottom navigation bar | Tab bar | `NavigationBar`, or `CupertinoTabScaffold` in a Cupertino shell |
| Blocking question | Material dialog | Centred alert | `showAdaptiveDialog` with `AlertDialog.adaptive` |
| List of actions | Modal bottom sheet | Action sheet | `showModalBottomSheet`, or `showCupertinoModalPopup` with `CupertinoActionSheet` |
| Switch, slider, checkbox, progress | Material look | Cupertino look | `Switch.adaptive`, `Slider.adaptive`, `Checkbox.adaptive`, `CircularProgressIndicator.adaptive` |
| Scroll feel | Stretch at the edge | Bounce at the edge | Leave the default scroll behaviour alone; it already follows the platform. |
| Pull to refresh | Material indicator | Cupertino spinner | `RefreshIndicator.adaptive` |
| Share and back icons | Platform glyphs differ | Platform glyphs differ | `Icons.adaptive.share`, `Icons.adaptive.arrow_back` |
| App bar title | Start-aligned | Centred | `AppBar` does this by platform; do not force it. |
| Date and time | Material pickers | Wheel pickers | `showDatePicker` and `showTimePicker`, or `CupertinoDatePicker` in a Cupertino shell |

Use the platform's own control whenever it fits the job. Draw a custom one only when none fits, and record why in the component inventory.

## Theming and tokens

Everything visual comes from the theme. No colour literal, `Color(0x...)`, `Colors.*`, font size, radius or padding number inside a screen or component widget.

| Token tier | Flutter home |
|---|---|
| Primitive | Constants in one tokens file: palette, spacing steps (4, 8, 12, 16, 24, 32), radii, durations. Imported only by theme code, never by screens. |
| Semantic | `ColorScheme` roles, `TextTheme` roles, and `ThemeExtension` classes for what those two lack: spacing, radii, elevation, motion, extra colour roles such as success and warning. |
| Component | Component themes on `ThemeData` (`filledButtonTheme`, `inputDecorationTheme`, `cardTheme`, `appBarTheme`, `navigationBarTheme`, `dialogTheme`). Style a component once here, not at each call site. |

- Build one `ThemeData` for light and one for dark from the same token file. Pass them to `MaterialApp` as `theme` and `darkTheme`; `themeMode` follows the system unless the product has its own switch.
- Read values through the context: `Theme.of(context).colorScheme.primary`, `Theme.of(context).textTheme.titleMedium`, `Theme.of(context).extension<AppSpacing>()`.
- A `ThemeExtension` implements `copyWith` and `lerp`, and is registered in `ThemeData.extensions` of both themes. A missing registration returns null at run time.
- Use colour pairs as designed: `onPrimary` on `primary`, `onSurface` on `surface`, `onErrorContainer` on `errorContainer`. Surface steps come from the `surfaceContainer` roles, not from opacity tricks.
- Map every type role in the design file to a `TextTheme` slot (display, headline, title, body, label; large, medium, small). Do not create ad hoc `TextStyle` objects in widgets; use `copyWith` on a theme style only for a recorded exception.
- Fonts are bundled through `pubspec.yaml`, or through a font package the project already depends on. Add no new package without approval.
- For Cupertino widgets inside a Material app, the Cupertino theme derives from the Material one; adjust it with `ThemeData.cupertinoOverrideTheme` instead of styling each widget.

`ColorScheme` from a seed:

| Use `ColorScheme.fromSeed` when | Do not use it when |
|---|---|
| There is no brand palette yet and one hue sets the direction | The brand has exact colours that must appear as specified; the seed algorithm re-tones them |
| A full, contrast-checked set of roles is needed quickly | The direction calls for neutral surfaces without a tint of the seed hue |
| Light and dark must stay related with little effort | The palette has several unrelated brand colours with fixed roles |

When the seed does not fit, start from the seeded scheme and override the roles that matter with `copyWith`, or write the full `ColorScheme` by hand. Check contrast for every pair that was overridden. Follow the user's wallpaper-based colours only if the design file says so and the project already has the package for it.

## Adaptive layout

Decide by the width of the window the app has been given, never by device type, operating system or orientation. Split-screen and foldables hand a tablet a phone-width window.

| Window size class | Width (dp) | Navigation | Body |
|---|---|---|---|
| Compact | under 600 | `NavigationBar` at the bottom, three to five destinations | One pane |
| Medium | 600 to 839 | `NavigationRail` | One pane, or list and detail when both fit |
| Expanded | 840 to 1199 | `NavigationRail`, or a permanent `NavigationDrawer` when there are many destinations | Two panes |
| Large | 1200 and up | Permanent `NavigationDrawer` | Two or three panes; cap the content width |

- App-level decisions (which navigation, how many panes): `MediaQuery.sizeOf(context).width`. It rebuilds only when the size changes.
- Component-level decisions: `LayoutBuilder` and the constraints it receives, so the component adapts to the space its parent gives it.
- Restructure; do not stretch. A phone layout scaled up on a tablet is a defect.
- Cap reading width with `ConstrainedBox` and centre the column on wide windows. Aim for 45 to 75 characters per line.
- Keep the selected destination, scroll position and input when the layout changes class (rotation, window resize, fold).
- Do not lock orientation to avoid a layout problem. Lock it only when the task demands it, and record it.

## Safe areas, keyboard, scrolling, long text

| Concern | Rule |
|---|---|
| System intrusions | Wrap body content in `SafeArea`. Let backgrounds and scrolling lists run edge to edge and pad their ends with `MediaQuery.paddingOf(context)` or `SliverSafeArea`. `Scaffold` already handles its app bar and bottom bar. |
| Keyboard | Keep `Scaffold.resizeToAvoidBottomInset` on. Put every form in a scrollable so the focused field can move into view. In a bottom sheet with fields, set `isScrollControlled: true` and pad by `MediaQuery.viewInsetsOf(context).bottom`. |
| Keyboard behaviour | Set `keyboardType`, `textInputAction` and `autofillHints` (inside an `AutofillGroup`) on every field. Move focus to the next field on the action key. Let a drag dismiss the keyboard in long forms (`keyboardDismissBehavior`). The primary action stays reachable while the keyboard is open. |
| Vertical overflow | Any column that can exceed the screen scrolls. This includes short screens at large text sizes and with the keyboard open. |
| Long lists | `ListView.builder` or slivers in a `CustomScrollView`. Do not nest a shrink-wrapped list inside another scrollable for long content. |
| Horizontal overflow | Text inside a `Row` sits in `Expanded` or `Flexible`. Groups of chips or buttons use `Wrap`. The striped overflow marker is always a defect. |
| Heights | No fixed height on anything that contains text. Use padding and a minimum height constraint so the box grows with the text. |
| Long text | Decide per text: wrap, or `maxLines` with `TextOverflow.ellipsis`. Truncate only when the full text is reachable elsewhere. Test with long names, long numbers and a longer language. |
| Direction | `EdgeInsetsDirectional`, `AlignmentDirectional` and `TextAlign.start`, so right-to-left needs no rewrite. |
| Numbers in columns | Tabular figures (`FontFeature.tabularFigures()`) so digits align. |

## Gestures and touch targets

- Every tappable target is at least 48 by 48 dp, with about 8 dp between neighbours. Material controls pad themselves to this size; do not shrink the tap target or tighten `VisualDensity` on touch layouts to save space. The iOS guideline is 44 pt; design to 48 and both pass.
- Prefer `IconButton`, `InkWell` and the button widgets to a bare `GestureDetector`. They bring pressed feedback, focus handling and semantics.
- Every gesture has a visible alternative. Swipe-to-delete also exists in a menu; a long-press action also exists behind a visible control.
- Swipe to dismiss (`Dismissible`) is followed by an undo `SnackBar` when the action can be reversed. Confirm first only when it cannot.
- Do not claim edges that belong to the system: the leading edge for back, the bottom edge for home.
- Reordering uses `ReorderableListView` with a visible drag handle.
- Primary actions sit within thumb reach on compact windows: bottom of the screen, not the top corner.

Haptics, where the platform convention has them:

| Moment | Call |
|---|---|
| Value ticks while dragging a picker or slider | `HapticFeedback.selectionClick()` |
| Toggle flips, item snaps into place | `HapticFeedback.lightImpact()` |
| Long-press picks an item up, a significant action commits | `HapticFeedback.mediumImpact()` |
| Rare, weighty confirmation | `HapticFeedback.heavyImpact()` |

Never on every tap, never on scroll, and never as the only feedback; the system setting can switch haptics off.

## Text scaling

- Layouts hold at a text scale of at least 1.3 on every screen: nothing clipped, overlapped or pushed off screen, every action still reachable.
- Never clamp the user's text scale to 1. No `TextScaler.noScaling`, no `MediaQuery.withNoTextScaling`, no `MediaQuery` override that sets a linear scale of 1.
- When a row no longer fits at large scale, change its structure (stack the label above the value, wrap the buttons); do not shrink the text.
- An upper cap with `MediaQuery.withClampedTextScaling` is allowed only around a single component that cannot reflow (for example bottom navigation labels), never below 1.3, and only as a recorded exception in `DESIGN.md`.
- Text styled from `TextTheme` scales by itself. Read the current scale with `MediaQuery.textScalerOf(context)` when a layout must branch on it.

## Accessibility

| Need | How |
|---|---|
| Name for an icon-only control | `tooltip` on `IconButton`; otherwise `Semantics(label: ...)` |
| Meaningful image | `semanticLabel` on `Image` or `Icon` |
| Decorative image | `excludeFromSemantics: true`, or wrap in `ExcludeSemantics` |
| Row read as one item | `MergeSemantics` |
| Section title | `Semantics(header: true, ...)` |
| Status that changes without focus moving | `Semantics(liveRegion: true, ...)` |
| Custom control | `Semantics` with its role (`button: true`), state (`enabled`, `selected`, `checked`) and `value` |
| Reading and focus order | Widget order first; `FocusTraversalGroup` to keep a region together |

- Contrast: 4.5:1 for body text, 3:1 for large text and for the parts of a control needed to recognise it, in both light and dark.
- Never signal state by colour alone; add an icon, a label or a shape change.
- With a hardware keyboard (tablets, desktop targets) every control is reachable, focus is visible, and common actions have shortcuts through `Shortcuts` and `Actions`.
- Respect the bold-text and high-contrast settings exposed by `MediaQuery`; do not hard-code a weight that fights them.
- Walk the primary flow with TalkBack or VoiceOver when a device or emulator is available. If not, report "not checked".

## Motion

- Platform curves and springs are fine here. Use the Material `Easing` and `Durations` constants, the stock page transitions for each platform, and spring simulations where the platform uses them (sheets, scroll, drag release).
- Durations and curves used by the app's own animations live in a `ThemeExtension`, not in widgets.
- Reach for implicit animations first (`AnimatedContainer`, `AnimatedOpacity`, `AnimatedSwitcher`); use `Hero` to carry one element between routes.
- Motion explains a change of state or place. No decorative loops. Animations can be interrupted; exits are shorter than entrances.
- Respect the platform's reduce-motion setting: read `MediaQuery.disableAnimationsOf(context)` (the `disableAnimations` flag). When it is on, replace travel and scale with a short fade or an instant change. Keep the state change visible; do not zero every duration app-wide.

## Navigation

- One navigation model, recorded in the interaction notes. Use the router the project already has; add none without approval.
- Three to five top-level destinations, labels always shown, in the same order in every size class. Secondary destinations go in a drawer or an overflow.
- Each top-level destination keeps its own stack and scroll position. Selecting the current destination again returns to its root.
- Back closes an open sheet, dialog or menu first, then pops the route, then leaves the app. Never trap the user; `PopScope` is for unsaved input only, with a clear choice.
- A deep link opens the screen with a sensible stack behind it, so back goes to the logical parent.
- Create and edit flows open as a full-screen dialog route (`fullscreenDialog: true`) with explicit close and save; drilling into detail is a normal push.
- Preserve scroll with `PageStorageKey`. Never nest one bottom bar inside another.

## Verification

| Check | How | Evidence it gives |
|---|---|---|
| Static analysis | `flutter analyze` | No analyser errors; says nothing about appearance |
| Golden tests | `flutter test`; baselines created or changed with `flutter test --update-goldens` | Layout at fixed sizes, modes and text scale |
| Overflow | Any widget test of the screen; an overflow raises an error and fails the test | No clipped rows or columns at the tested size |
| Accessibility guidelines | `meetsGuideline` in a widget test (below) | Tap-target size, text contrast, labelled targets |
| Real render | `flutter screenshot` against a running device or emulator, or an emulator capture | Real fonts, images, insets and system bars |

Golden matrix for each screen touched: small phone (360 by 640), large phone (430 by 932) and tablet (820 by 1180), each in light and dark, plus a pass at text scale 1.3. Add the states from the state matrix that the task touched.

```dart
testWidgets('orders: small phone, dark, text scale 1.3', (tester) async {
  tester.view.physicalSize = const Size(360, 640);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
  final handle = tester.ensureSemantics();
  await tester.pumpWidget(MaterialApp(
    theme: lightTheme, darkTheme: darkTheme, themeMode: ThemeMode.dark,
    builder: (context, child) => MediaQuery(
      data: MediaQuery.of(context).copyWith(textScaler: const TextScaler.linear(1.3)),
      child: child!,
    ),
    home: const OrdersScreen(),
  ));
  await tester.pumpAndSettle();
  await expectLater(find.byType(OrdersScreen), matchesGoldenFile('goldens/orders_small_dark_130.png'));
  await expectLater(tester, meetsGuideline(androidTapTargetGuideline));
  await expectLater(tester, meetsGuideline(iOSTapTargetGuideline));
  await expectLater(tester, meetsGuideline(textContrastGuideline));
  await expectLater(tester, meetsGuideline(labeledTapTargetGuideline));
  handle.dispose();
});
```

- Widget tests draw text with a placeholder test font unless the app's fonts are loaded in the test. Such goldens prove layout, not typography; say so in the report or load the fonts.
- Network images do not load in widget tests. Supply test images, or the golden shows empty boxes.
- `pumpAndSettle` never returns while an endless animation runs. Stop the animation in the test, or pump a fixed duration.
- Update baselines only for an intended visual change, and read the image diff first. Generate them on one operating system; rendering differs between hosts.
- No device, emulator or golden run available: report "not captured" and use the label `Source inspected only` from `review.md`.

The brief or the project's design system overrides any default here.
