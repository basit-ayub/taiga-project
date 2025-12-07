describe('Create Project Selector Tests', () => {

  const baseUrl = "http://localhost:9000";
  const loginUrl = baseUrl + '/login';
  const projectUrl = baseUrl + '/project/new';

  const username = 'admin';
  const password = 'admin';


  function closeTaigaPopup() {
    cy.get('body').then($body => {
      const popup = $body.find('.newsletter-email.lightbox');

      if (popup.length > 0 && popup.is(':visible')) {
        cy.log("🔥 Popup detected → Removing from DOM (no reload)");

        cy.document().then(doc => {
          const el = doc.querySelector('.newsletter-email.lightbox');
          if (el) el.remove();  // 🔥 SAFE: no reload, no logout
        });

        cy.get('.newsletter-email.lightbox').should('not.exist');
      } else {
        cy.log("✔ No popup found");
      }
    });
  }

  // ----------------------------------------------------------------------

  beforeEach(() => {

    // Login
    cy.visit(loginUrl);

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/login');

    // Go to create-project page
    cy.visit(projectUrl);

    // 🔥 ALWAYS remove popup after arriving
    closeTaigaPopup();

    // Ensure template selector is ready
    cy.get('.create-project-selector', { timeout: 8000 }).should('be.visible');
  });

  // ----------------------------------------------------------------------

  it('TC-01: All project templates should be visible', () => {
    cy.contains('.create-project-selector-template', 'Scrum').should('be.visible');
    cy.contains('.create-project-selector-template', 'Kanban').should('be.visible');
    cy.contains('.create-project-selector-template', 'Duplicate project').should('be.visible');
    cy.contains('.create-project-selector-template', 'Import project').should('be.visible');
  });

  it('TC-03: Scrum navigation', () => {
    cy.contains('.create-project-selector-template', 'Scrum')
      .click({ force: true });
    cy.url().should('include', '/project/new/scrum');
  });

  it('TC-04: Kanban navigation', () => {
    cy.contains('.create-project-selector-template', 'Kanban')
      .click({ force: true });
    cy.url().should('include', '/project/new/kanban');
  });

  it('TC-05: Duplicate project navigation', () => {
    cy.contains('.create-project-selector-template', 'Duplicate project')
      .click({ force: true });
    cy.url().should('include', '/project/new/duplicate');
  });

  it('TC-06: Import project navigation', () => {
    cy.contains('.create-project-selector-template', 'Import project')
      .click({ force: true });
    cy.url().should('include', '/project/new/import');
  });

});