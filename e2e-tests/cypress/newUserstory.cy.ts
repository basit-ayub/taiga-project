describe('User Story Creation Tests', () => {

  const loginUrl = '/login';
  const backlogUrl = '/project/public-project/backlog';
  const username = 'admin';
  const password = 'admin';

  beforeEach(() => {
  cy.visit(loginUrl);

  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();

  cy.url().should('not.include', '/login');

  cy.visit(backlogUrl);

  cy.contains('Backlog').should('exist');

  // Click visible "Add a user story" button
  cy.contains('Add a user story')
    .filter(':visible')
    .click({ force: true });

  // Wait for Create User Story Form
  cy.get('form[ng-if="lightboxOpen"]', { timeout: 10000 })
    .should('be.visible')
    .and('contain', 'New user story');
});



  // TC-1 — minimal creation
  it('TC-01: Create basic user story', () => {

    cy.get("input[name='subject']")
      .type("Basic Test Story");

    cy.get("#submitButton").click();

    cy.get(".modal").should("not.exist");
  });


  // TC-2 — add tags + bottom location
  it('TC-02: Create US with tags + bottom location', () => {

    cy.get("input[name='subject']")
      .type("Story with Tags");

    // Tags
    cy.contains("Add tag").click();
    cy.get(".tags-block input")
      .type("automation{enter}");

    // Location
    cy.get("input[value='bottom']").check({ force: true });

    cy.get("#submitButton").click();

    cy.get(".modal").should("not.exist");
  });


//   // TC-3 — full form (attachments mocked)
//   it('TC-03: Create US with full fields', () => {

//     // Mock upload
//     cy.intercept("POST", "**/attachments**", {
//       statusCode: 200,
//       body: { id: "777", name: "dummy.txt" }
//     }).as("mockUpload");

//     cy.get("input[name='subject']")
//       .type("Full Story");

//     cy.get(".status-dropdown").click();
//     cy.contains(".status", "Ready").click();

//     cy.contains("Add tag").click();
//     cy.get(".tags-block input")
//       .type("full{enter}");

//     cy.get("textarea[name='description']")
//       .type("Full description test");

//     // Attachment
//     cy.get("input[type='file']").selectFile("cypress/fixtures/dummy.txt", {
//       force: true
//     });
//     cy.wait("@mockUpload");

//     cy.get("#submitButton").click();

//     cy.get(".modal").should("not.exist");
//   });

  // TC-4 — Error case (missing subject)
  it('TC-04: Error validation - no subject', () => {

    cy.get("#submitButton").click();

    // Form browser error
    cy.contains('This value is required').should('be.visible');
})

});
