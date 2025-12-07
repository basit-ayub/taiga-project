describe('Login Form Test Cases', () => {
  const url = '/login'; // replace with your login page URL

  // TC-01: Empty fields
  it('TC-01: Submit empty fields', () => {
    cy.visit(url);
    cy.get('#submitButton, button[type="submit"]').click();
    cy.url().should('include','/login');
  });

  // TC-02: Invalid login
  it('TC-02: Invalid username/password', () => {
    cy.visit(url);
    cy.get('#username, input[name="username"]').type('wrongUser');
    cy.get('#password, input[name="password"]').type('wrongPass');
    cy.get('#submitButton, button[type="submit"]').click();
    cy.contains(/invalid|incorrect|error/i).should('exist');
  });

  // TC-03: Valid login
  it('TC-03: Valid login with correct credentials', () => {
    cy.visit(url);
    cy.get('#username, input[name="username"]').type('admin');
    cy.get('#password, input[name="password"]').type('admin');
    cy.get('#submitButton, button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });

  // TC-04: Forgot password link
  it('TC-04: Navigate to forgot password page', () => {
    cy.visit(url);
    cy.get('.forgot-pass').click();
    cy.url().should('include', 'forgot-password');
  });

  // TC-05: Caps lock detection
  // it('TC-05: Caps lock icon appears on password input', () => {
  //   cy.visit(url);
  //   cy.get('input[name="password"]').focus();
  //   cy.get('input[name="password"]').trigger('keyup', {
  //     key: 'A',
  //     shiftKey: true
  //   });
  //   cy.get('.capslock').should('be.visible');
  // });

});
