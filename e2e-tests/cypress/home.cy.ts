/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Home E2E Tests
 * Converted from: e2e/suites/home.e2e.js
 */

describe('Home', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/');
        cy.waitLoader();
        cy.takeNamedScreenshot('home', 'dashboard');
    });

    it('working on section should be filled', () => {
        cy.get('.working-on div[tg-duty]').should('have.length.above', 0);
    });

    it('watching section should be filled', () => {
        cy.get('.watching div[tg-duty]').should('have.length.above', 0);
    });

    it('project list should be filled', () => {
        cy.get('.home-project').should('have.length.above', 0);
    });

    describe('Projects List', () => {
        before(() => {
            cy.visit('/projects/');
            cy.waitLoader();
            cy.takeNamedScreenshot('home', 'projects');
        });

        it('should display projects', () => {
            cy.get('.list-itemtype-project').should('have.length.above', 0);
        });
    });

    describe('Project Drag and Drop', () => {
        let draggedElementText: string;

        before(() => {
            cy.visit('/projects/');
            cy.waitLoader();
        });

        it('should reorder projects list', () => {
            // Get the 4th project name
            cy.get('.list-itemtype-project').eq(3).find('h2 a').invoke('text').then((text) => {
                draggedElementText = text;

                // Drag 4th project to first position
                cy.get('.list-itemtype-project').eq(3).dragTo('.list-itemtype-project:first');

                cy.wait(500);

                // Verify first element is now the dragged element
                cy.get('.list-itemtype-project h2 a').first().invoke('text').should('eq', draggedElementText);
            });
        });

        it('should update projects menu order', () => {
            cy.get('div[tg-dropdown-project-list] ul a span')
                .first()
                .invoke('html')
                .should('eq', draggedElementText);
        });

        after(() => {
            // Restore project position
            cy.get('.list-itemtype-project').first().dragTo('.list-itemtype-project:nth-child(4)');
            cy.wait(500);
        });
    });
});
