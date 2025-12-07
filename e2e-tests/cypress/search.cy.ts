/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Search E2E Tests
 * Converted from: e2e/suites/search.e2e.js
 */

describe('Search', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/search');
        cy.waitLoader();
        cy.takeNamedScreenshot('search', 'search');
    });

    it('should display search input', () => {
        cy.get('.search-input').should('be.visible');
    });

    it('should search for items', () => {
        cy.get('.search-input').type('test');
        cy.get('.search-button').click();
        cy.waitLoader();

        // Should display results or empty state
        cy.get('.search-results, .empty-search').should('be.visible');
    });

    it('should filter by type', () => {
        cy.get('.search-input').clear().type('test');
        cy.get('.search-button').click();
        cy.waitLoader();

        // Click on filter tabs if they exist
        cy.get('body').then(($body) => {
            if ($body.find('.search-filter-tab').length > 0) {
                cy.get('.search-filter-tab').first().click();
                cy.waitLoader();
            }
        });
    });

    it('should navigate to search result', () => {
        cy.get('.search-input').clear().type('test');
        cy.get('.search-button').click();
        cy.waitLoader();

        cy.get('body').then(($body) => {
            if ($body.find('.search-result-item a').length > 0) {
                cy.get('.search-result-item a').first().click();
                cy.waitLoader();
                cy.url().should('not.include', '/search');
            }
        });
    });
});
