module.exports = {
  description: "Fusotao Wiki",
  head: [
    ["title", {}, "Fusotao Wiki"],
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  ],
  base: "/",
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Fusotao", link: "https://www.fusotao.org" },
      { text: "Github", link: "https://github.com/uinb" },
    ],
    sidebar: ["/", "architecture", "development", "tokens"],
    sidebarDepth: 3,
    smoothScroll: true,
    displayAllHeaders: false
  },
};
