/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "os-coach-psych",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const site = new sst.aws.StaticSite("psych", {
      path: ".",
      buildCommand: "node ./sst/scripts/build-static.mjs",
      buildOutput: "dist",
      domain: {
        name: "psych.os.coach",
        hostedZone: "os.coach"
      },
      errorPage: "index.html"
    });

    return {
      webUrl: site.url
    };
  },
});
