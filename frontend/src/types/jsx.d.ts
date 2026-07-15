declare module "*.jsx" {
  const Component: any;
  export default Component;
}

declare module "@features/*" {
  const mod: any;
  export default mod;
}

