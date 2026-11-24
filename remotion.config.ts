import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// The film shares the site's components, so it needs the site's Tailwind and path aliases.
Config.overrideWebpackConfig((current) => {
  const config = enableTailwind(current);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@content": path.join(process.cwd(), "content"),
        "@": path.join(process.cwd(), "src"),
      },
    },
  };
});
