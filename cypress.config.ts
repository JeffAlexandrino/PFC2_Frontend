import { defineConfig } from "cypress";

export default defineConfig({
    defaultBrowser: "chrome",
    numTestsKeptInMemory: 40,
    experimentalMemoryManagement: true,
    waitForAnimations: false,
    watchForFileChanges: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    e2e: {
        retries: 6,
        baseUrl: "http://localhost:3000",
        supportFile: "./cypress/support/e2e.ts",
        experimentalRunAllSpecs: true,
        setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);
            return config;
        },
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "webpack",
        },
        supportFile: "./cypress/support/component.ts",
        setupNodeEvents(on, config) {
            require("@cypress/code-coverage/task")(on, config);
            return config;
        },
    },
});
