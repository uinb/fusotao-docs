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
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Fusotao", link: "https://fusotao.org" },
      { text: "Github", link: "https://github.com/uinb/fusotao" },
    ],
    sidebar: ["/", "conceptions-and-architectures", "interacting-with-fusotao", "participating-the-mainnet"],
    sidebarDepth: 3,
    smoothScroll: true,
    displayAllHeaders:true
  },
};
