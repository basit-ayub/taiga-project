describe('Forgot Password Form Test Cases', () => {
  const url = '/forgot-password'; // replace with your forgot password page URL

  // TC-01: Page Load
  it('TC-01: Forgot Password page loads correctly', () => {
    cy.visit(url);
    cy.get('form').should('be.visible');
    cy.get('input[name="username"]').should('be.visible');
    cy.contains('button', 'Reset Password').should('be.visible');
    cy.contains('Nah, take me back. I think I remember it.').should('be.visible');
  });

  // TC-02: Submit empty username
  it('TC-02: Submit empty username field', () => {
    cy.visit(url);
    cy.get('button').contains('Reset Password').click();
    // Check for Taiga validation message
    cy.contains('This value is required.').should('be.visible');
  });

  // TC-03: Submit unregistered username
  it('TC-03: Submit unregistered username', () => {
    cy.visit(url);
    cy.get('input[name="username"]').type('unknown@gmail.com'); // Unregistered username
    cy.get('button').contains('Reset Password').click();
    cy.contains('According to the Taiga, you are not registered yet.').should('be.visible');
  });

  // TC-04: Submit valid username
 it('TC-04: Submit valid username', () => {
  cy.visit(url);
  cy.get('input[name="username"]').type('basit'); // Registered username
  cy.get('button').contains('Reset Password').click();

  // Wait for redirect to login page
  cy.url().should('include', '/login');

  // Then check that the success message is visible on login page
  cy.contains('Check your inbox! We sent you an email with the instructions to set a new password')
    .should('be.visible');
});


  // TC-05: Cancel link navigates back to login
  it('TC-05: Cancel link navigates to login page', () => {
    cy.visit(url);
    cy.contains('Nah, take me back. I think I remember it.').click();
    cy.url().should('include', '/login');
  });
});
