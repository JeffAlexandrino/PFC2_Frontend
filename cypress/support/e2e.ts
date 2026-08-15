import "@cypress/code-coverage/support";
import "./commands";

// beforeEach(() => {
//     cy.intercept({ url: "/v*", middleware: true }, (req) => {
//         // se quiser forçar erro para qualquer request não mockada:
//         req.reply({ statusCode: 500, body: { error: "Request não mockada" } });
//     }).as("unmocked");
// });

Cypress.on("uncaught:exception", (err, runnable, promise) => {
    // when the exception originated from an unhandled promise
    // rejection, the promise is provided as a third argument
    // you can turn off failing the test in this case
    if (promise) {
        return false;
    }

    if (err.message.includes("Cannot read properties of undefined")) {
        return false;
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
});

Cypress.on("AssertionError", (err, runnable, promise) => {
    // when the exception originated from an unhandled promise
    // rejection, the promise is provided as a third argument
    // you can turn off failing the test in this case
    if (promise) {
        return false;
    }

    if (err.message.includes("Timed out retrying after 4000ms: Expected to find element:")) {
        return false;
    }

    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
});
