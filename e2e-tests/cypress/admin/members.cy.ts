/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Admin Members E2E Tests
 * Converted from: e2e/suites/admin/members.e2e.js
 */

import * as adminMemberships from '../../support/pages/admin-memberships.page';

describe('Admin Members', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/admin/memberships');
        cy.waitLoader();
        cy.takeNamedScreenshot('admin', 'members');
    });

    it('should display members list', () => {
        adminMemberships.getMembers().should('have.length.above', 0);
    });

    describe('Add Member', () => {
        it('should open add member lightbox', () => {
            adminMemberships.openNewMemberLightbox();
            const lightbox = adminMemberships.getNewMemberLightbox();
            lightbox.waitOpen();
            cy.takeNamedScreenshot('admin', 'add-member');
        });

        it('should add new member', () => {
            const lightbox = adminMemberships.getNewMemberLightbox();
            const newEmail = `test-${Date.now()}@example.com`;

            lightbox.newEmail(newEmail);
            lightbox.setRole(0);
            lightbox.submit();
            lightbox.waitClose();

            cy.waitNotificationSuccess();
        });
    });

    describe('Change Role', () => {
        it('should change member role', () => {
            adminMemberships.changeRole(1, 2);
            cy.wait(500);
        });
    });

    describe('Toggle Admin', () => {
        it('should toggle admin status', () => {
            adminMemberships.isAdmin(1).then((wasAdmin) => {
                adminMemberships.toggleAdmin(1);
                cy.wait(500);

                adminMemberships.isAdmin(1).should('not.eq', wasAdmin);
            });
        });
    });

    describe('Delete Member', () => {
        it('should delete member', () => {
            adminMemberships.getMembers().its('length').then((count) => {
                adminMemberships.deleteMember(count - 1);

                adminMemberships.getMembers().should('have.length', count - 1);
            });
        });
    });

    describe('Pending Invitations', () => {
        it('should display pending invitations', () => {
            cy.get('body').then(($body) => {
                if ($body.find('.pending-member-row').length > 0) {
                    adminMemberships.getPendingInvitations().should('have.length.above', 0);
                }
            });
        });
    });
});
