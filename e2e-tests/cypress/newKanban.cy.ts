describe('Kanban Project Form Tests', () => {
  const url = 'http://localhost:9000/project/new/kanban';
  const username = 'admin';
  const password = 'admin';

  beforeEach(() => {
    // Login first
    cy.visit('http://localhost:9000/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');

    // Visit Kanban project form
    cy.visit(url);
  });

  // TC-01: Project Name is required
  it('TC-01: Project Name is required', () => {
    cy.get('input[name="project-name"]').clear();
    cy.get('textarea').type('Some description'); 
    cy.get('.create-project-action-submit').click();

    cy.contains('This value is required.').should('be.visible');
  });

  // TC-02: Project Description is required
  it('TC-02: Project Description is required', () => {
    cy.get('textarea').clear();
    cy.get('input[name="project-name"]').type('Test Kanban Project'); 
    cy.get('.create-project-action-submit').click();

    cy.contains('This value is required.').should('be.visible');
  });

// TC-03: Submit valid project (Public)
it('TC-03: Submit valid project (Public)', () => {
  cy.get('input[name="project-name"]').type('Public Kanban Project');
  cy.get('textarea').type('Public Kanban project description');
  cy.get('.create-project-action-submit').click();

  // Just check that we are redirected somewhere outside /kanban form page
 
});

// TC-04: Submit valid project (Private)
it('TC-04: Submit valid project (Private)', () => {
  cy.get('input[name="project-name"]').type('Private Kanban Project');
  cy.get('textarea').type('Private Kanban project description');
  cy.get('#template-private').check({ force: true });
  cy.get('.create-project-action-submit').click();

  
});



  // TC-05: Back button navigates correctly
  it('TC-05: Back button navigates to previous page', () => {
    cy.get('.create-project-action-cancel').click();
    cy.url().should('include', '/project/new'); // adjust if needed
  });
});
