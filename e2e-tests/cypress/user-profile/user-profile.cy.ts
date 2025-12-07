/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * User Profile E2E Tests
 * Converted from: e2e/suites/user-profile/*.e2e.js
 */

describe('User Profile', () => {
    beforeEach(() => {
        cy.login('admin', '123123');
    });

    describe('Profile Activity', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/profile/admin');
            cy.waitLoader();
            cy.takeNamedScreenshot('user-profile', 'activity');
        });

        it('should display user profile', () => {
            cy.get('.profile-header, .user-profile-name').should('be.visible');
        });

        it('should display activity timeline', () => {
            cy.get('.activity-item, .timeline-entry').should('have.length.above', 0);
        });
    });

    describe('Profile Contacts', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/profile/admin/contacts');
            cy.waitLoader();
        });

        it('should display contacts section', () => {
            cy.get('.contacts-list, .profile-contacts').should('be.visible');
        });
    });

    describe('Profile Projects', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/profile/admin/projects');
            cy.waitLoader();
        });

        it('should display user projects', () => {
            cy.get('.project-item, .profile-projects').should('be.visible');
        });
    });

    describe('Edit Profile', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/user-settings/user-profile');
            cy.waitLoader();
            cy.takeNamedScreenshot('user-profile', 'edit-profile');
        });

        it('should display edit form', () => {
            cy.get('input[name="full_name"], input[name="username"]').should('be.visible');
        });

        it('should update profile', () => {
            const newBio = `Updated bio ${Date.now()}`;

            cy.get('textarea[name="bio"]').clear().type(newBio);
            cy.get('.submit-button, button[type="submit"]').click();

            cy.waitNotificationSuccess();
        });
    });

    describe('Change Password', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/user-settings/user-change-password');
            cy.waitLoader();
        });

        it('should display change password form', () => {
            cy.get('#current-password, input[name="current_password"]').should('be.visible');
            cy.get('#new-password, input[name="new_password"]').should('be.visible');
        });
    });

    describe('Email Notifications', () => {
        before(() => {
            cy.login('admin', '123123');
            cy.visit('/user-settings/mail-notifications');
            cy.waitLoader();
            cy.takeNamedScreenshot('user-profile', 'email-notifications');
        });

        it('should display notification settings', () => {
            cy.get('.notification-option, .mail-notification-item').should('have.length.above', 0);
        });

        it('should toggle notification setting', () => {
            cy.get('.notification-option input, .mail-notification-item input').first().click();
            cy.waitNotificationSuccess();
        });
    });
});
