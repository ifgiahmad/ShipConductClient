declare module "heic2any" {
  const heic2any: (options: { blob: Blob; toType: string }) => Promise<Blob>;
  export default heic2any;
}
