// https://docs.astro.build/en/reference/vite-plugin-astro/#typescript
declare module "*.astro" {
  const Component: (props: any) => any;
  export default Component;
}
