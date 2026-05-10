// Global data
type Config = {
  title: string;
  description: string;
  lang: string;
  favicon: string;
  og: {
    image: string;
    imageAlt: string;
    imageType: string;
    imageWidth: string;
    imageHeight: string;
  };
};

export const siteConfig: Config = {
  title: "leopard.in.ua",
  description: "Oleksii Vasyliev blog",
  lang: "en",
  favicon: "/favicon.svg",
  og: {
    image: "/ogImage.png",
    imageAlt: "leopard.in.ua",
    imageType: "image/png",
    imageWidth: "1200",
    imageHeight: "630",
  },
};
