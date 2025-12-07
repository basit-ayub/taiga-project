import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000',
    // We look for the .cy.ts files in your new structure
    specPattern: [
      'cypress/newlogin.cy.ts',   
      'cypress/newforgotpassword.cy.ts', 
      'cypress/newProject.cy.ts',       
      'cypress/newScrum.cy.ts',       
      'cypress/newKanban.cy.ts',       
      'cypress/newUserstory.cy.ts',       
      'cypress/newSprint.cy.ts',       
      'cypress/newDuplicate.cy.ts',       
    ], 
    
    // Point to the support file in your new structure
    supportFile: 'cypress/support/e2e.ts',
    
    video: false,
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});