// 为 SVG 文件添加类型声明
declare module "*.svg" {
  const content: string;
  export default content;
}

// 为 CSS 文件添加类型声明
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// 为 HTML 文件添加类型声明
declare module "*.html" {
  const content: string;
  export default content;
}
