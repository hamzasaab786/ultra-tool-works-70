# Project rules

- Keep blog articles as typed static data in category modules, indexed through `src/data/blog/index.ts`, so client rendering and prerendered search pages use the same content.
- Give every catalog tool one dedicated blog guide with a canonical working tool link; preserve existing articles when extending coverage.
- Distinguish editorial keyword candidates from measured search data; never infer difficulty or volume from missing data.
- Client blog lists must import lightweight metadata only; article bodies load by category on demand, with the same editorial transformation used by prerendering.
- Use one-shot viewport reveals, not sitewide scroll-driven card layout reads, to keep tool interaction smooth.