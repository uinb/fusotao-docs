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
      { text: "Website", link: "https://fusotao.org" },
      { text: "Docs", link: "/" },
      { text: "Github", link: "https://github.com/uinb/fusotao" },
    ],
    sidebar: ["/", "/todo"],
    sidebarDepth: 3,
    smoothScroll: true,
    displayAllHeaders:true
  },
};
