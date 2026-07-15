# TODO

- [ ] Explore Tailwind/Vite/PostCSS configuration and entry CSS imports.
- [ ] Remove ambiguity: delete `frontend/tailwind.config.ts` so Tailwind uses only `frontend/tailwind.config.js`.
- [ ] Ensure `frontend/tailwind.config.js` matches the required `content` + empty `theme.extend` + empty `plugins`.
- [ ] Confirm `frontend/src/styles/theme/global.css` imports Tailwind directives in correct order.
- [ ] Rebuild frontend: `cd frontend && npm run build`.
- [ ] Inspect built CSS in `frontend/dist/assets/*.css` for selectors `.bg-white`, `.rounded-xl`, `.shadow-sm`, `.grid`.
- [ ] Report evidence (lines/regex matches) proving which selectors exist.
- [ ] If any selector missing, diagnose Tailwind v4 scanning/content resolution and apply smallest fix; rebuild and re-verify.

