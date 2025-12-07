describe("Duplicate Project Test", () => {

  const loginUrl = "/login";
  const duplicateUrl = "/project/new/duplicate";
  const username = "admin";
  const password = "admin";

  beforeEach(() => {
    // login
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should("not.include", "/login");

    // go to duplicate project page
    cy.visit(duplicateUrl);
  });

  it("TC-01: Successfully duplicate a project", () => {

    // Select project from dropdown
    cy.get("#project-selector-dropdown")
      .select("Public Project"); 

    // Fill project name
    cy.get('input[name="project-name"]')
      .type("Automation Duplicate Project 2");

    // Fill project description
    cy.get("textarea")
      .type("This is a duplicated project created by Cypress automation.");

    // Submit form
    cy.contains("button", "Create Project")
      .click();

    // Assert project created → URL changed
    cy.url().should("include", "/project/automation-duplicate-project");
  });

});
