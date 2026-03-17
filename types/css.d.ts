/**
 * @file css.ts
 * @description Type declaration for importing CSS modules.
 */

declare module "*.css" {
  const content: { [className: string]: string }
  export default content
}
