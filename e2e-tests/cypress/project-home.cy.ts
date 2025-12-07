/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Project Home E2E Tests
 * Converted from: e2e/suites/project-home.e2e.js
 */

describe('Project Home', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/timeline');
        cy.waitLoader();
        cy.takeNamedScreenshot('project', 'project-home');
    });

    it('should display project timeline', () => {
        cy.get('.timeline-entry, .activity-item').should('have.length.above', 0);
    });

    it('should display project name', () => {
        cy.get('.project-name, .project-title').should('be.visible');
    });

    it('should display project stats', () => {
        cy.get('.project-stats, .stats-container').should('be.visible');
    });

    it('should navigate to backlog', () => {
        cy.get('#nav-backlog a').click();
        cy.waitLoader();
        cy.url().should('include', '/backlog');
    });

    it('should navigate to kanban', () => {
        cy.visit('/project/project-0/timeline');
        cy.waitLoader();
        cy.get('#nav-kanban a').click();
        cy.waitLoader();
        cy.url().should('include', '/kanban');
    });

    it('should navigate to issues', () => {
        cy.visit('/project/project-0/timeline');
        cy.waitLoader();
        cy.get('#nav-issues a').click();
        cy.waitLoader();
        cy.url().should('include', '/issues');
    });

    it('should navigate to wiki', () => {
        cy.visit('/project/project-0/timeline');
        cy.waitLoader();
        cy.get('#nav-wiki a').click();
        cy.waitLoader();
        cy.url().should('include', '/wiki');
    });
});
