# AVA Motion System

Reusable motion utilities for this Next.js App Router project. The shared root layout includes the Oiseau flight intro, keyed route transitions, and the global header. The homepage uses `Section` for scroll reveals. Visit `/motion-demo` to try staggered content, same-page scrolling, and cross-page anchors.

## Install

Framer Motion is the only added dependency and is already listed in this project's `package.json`:

```bash
npm install framer-motion
```

```json
{
  "dependencies": {
    "framer-motion": "^13.5.0"
  }
}
```

## Components

- `components/IntroFlight.tsx` animates `/images/Oiseau.png` along a responsive path with an SVG trail. It plays once automatically; reduced-motion preferences bypass the flight.
- `components/AnimatedLayout.tsx` keys route content by `usePathname()` and uses `AnimatePresence` in `mode="wait"`. Set `duration` in seconds and `easing` to a Framer Motion easing name or cubic-bezier tuple.
- `components/AnimatedPage.tsx` animates route enter/exit using only opacity and vertical transform. It focuses the incoming page or a pending anchor after the transition.
- `components/Section.tsx` reveals content with fade and slide. It accepts `threshold`, `rootMargin`, `once`, `staggerChildren`, `duration`, and `easing`.
- `hooks/useInViewReveal.ts` shares `IntersectionObserver` instances for equal threshold/root-margin configurations.
- `components/ScrollLink.tsx` supports `#section` and `/<route>#section` links. It accounts for fixed-header height and CSS `scroll-margin-top`, then temporarily sets `tabindex="-1"` and focuses the target.

## Usage

```tsx
import ScrollLink from "../components/ScrollLink";
import Section from "../components/Section";

<ScrollLink href="#apartments">Apartments</ScrollLink>
<ScrollLink href="/#contact">Contact on the homepage</ScrollLink>

<Section threshold={0.2} rootMargin="0px 0px -64px 0px" once staggerChildren={0.1}>
  <article>First item</article>
  <article>Second item</article>
</Section>
```

The root layout wraps route children with `AnimatedLayout`. To customize route transitions, edit its `duration` and `easing` props in `app/layout.tsx`. Reveal timing and observer options can be set per `Section`. Anchor targets should have stable IDs and should use `scroll-margin-top` when they need a CSS-defined fixed-header offset.

All components render useful HTML on the server. Anchors remain real links without JavaScript, and sections start visible in server-rendered HTML. Reduced-motion preferences turn off route, reveal, and smooth-scroll motion.
