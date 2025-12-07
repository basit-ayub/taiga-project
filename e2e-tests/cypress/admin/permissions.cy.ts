/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Admin Permissions E2E Tests
 * Converted from: e2e/suites/admin/permissions.e2e.js
 */

describe('Admin Permissions', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/admin/roles');
        cy.waitLoader();
        cy.takeNamedScreenshot('admin', 'permissions');
    });

    it('should display roles', () => {
        cy.get('.role-row').should('have.length.above', 0);
    });

    it('should expand role permissions', () => {
        cy.get('.role-row').first().click();
        cy.get('.permissions-container').first().should('be.visible');
        cy.takeNamedScreenshot('admin', 'permissions-expanded');
    });

    it('should toggle permission', () => {
        cy.get('.role-row').first().click();
        cy.get('.permissions-container').first().find('.permission-checkbox').first().then(($checkbox) => {
            const wasChecked = $checkbox.hasClass('checked');
            cy.wrap($checkbox).click();
            cy.wait(500);

            if (wasChecked) {
                cy.wrap($checkbox).should('not.have.class', 'checked');
            } else {
                cy.wrap($checkbox).should('have.class', 'checked');
            }
        });
    });

    it('should create new role', () => {
        cy.get('.add-role-button').click();

        cy.waitLightboxOpen('.lightbox-create-role');

        const roleName = `TestRole-${Date.now()}`;
        cy.get('.lightbox-create-role input[name="name"]').type(roleName);
        cy.get('.lightbox-create-role button[type="submit"]').click();

        cy.waitLightboxClose('.lightbox-create-role');
        cy.waitNotificationSuccess();

        cy.get('.role-row').should('contain', roleName);
    });

    it('should delete role', () => {
        cy.get('.role-row').its('length').then((count) => {
            cy.get('.role-row').last().find('.delete-role').click();
            cy.confirmOk();

            cy.get('.role-row').should('have.length', count - 1);
        });
    });
});
