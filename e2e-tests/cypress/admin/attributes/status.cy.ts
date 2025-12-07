/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Admin Status Attributes E2E Tests
 * Converted from: e2e/suites/admin/attributes/status.e2e.js
 */

import * as adminAttributes from '../../../support/pages/admin-attributes.page';

describe('Admin Status Attributes', () => {
    const attributeType = 'status';

    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/admin/project-values/status');
        cy.waitLoader();
        cy.takeNamedScreenshot('admin', 'status-attributes');
    });

    it('should display status list', () => {
        adminAttributes.getRows(attributeType).should('have.length.above', 0);
    });

    describe('Create Status', () => {
        it('should open create form', () => {
            adminAttributes.openCreate(attributeType);
            cy.get('.attribute-row.new-value').should('be.visible');
        });

        it('should create new status', () => {
            adminAttributes.getRows(attributeType).its('length').then((count) => {
                const statusName = `Status-${Date.now()}`;
                adminAttributes.fillNewAttribute(statusName);
                adminAttributes.submitNew();

                cy.wait(1000);
                adminAttributes.getRows(attributeType).should('have.length', count + 1);
            });
        });
    });

    describe('Edit Status', () => {
        it('should edit status name', () => {
            adminAttributes.openEdit(attributeType, 0);

            const newName = `Edited-${Date.now()}`;
            adminAttributes.editName(newName);
            adminAttributes.submitEdit();

            cy.wait(500);
            adminAttributes.getAttributeName(attributeType, 0).should('contain', newName);
        });
    });

    describe('Archive Status', () => {
        it('should toggle archive status', () => {
            adminAttributes.isStatusArchived(attributeType, 0).then((wasArchived) => {
                adminAttributes.toggleStatusArchived(attributeType, 0);
                cy.wait(500);

                adminAttributes.isStatusArchived(attributeType, 0).should('not.eq', wasArchived);
            });
        });
    });

    describe('Delete Status', () => {
        it('should delete status', () => {
            adminAttributes.getRows(attributeType).its('length').then((count) => {
                adminAttributes.deleteAttribute(attributeType, count - 1);

                adminAttributes.getRows(attributeType).should('have.length', count - 1);
            });
        });
    });

    describe('Drag Reorder', () => {
        it('should reorder statuses', () => {
            adminAttributes.getRows(attributeType).its('length').then((count) => {
                if (count > 1) {
                    adminAttributes.getAttributeName(attributeType, 1).then((secondName) => {
                        adminAttributes.dragAttribute(attributeType, 1, 0);
                        cy.wait(500);

                        adminAttributes.getAttributeName(attributeType, 0).should('contain', secondName);
                    });
                }
            });
        });
    });
});
