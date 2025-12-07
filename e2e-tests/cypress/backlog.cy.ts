/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Backlog E2E Tests
 * Converted from: e2e/suites/backlog.e2e.js
 */

import * as backlogHelper from '../support/pages/backlog.page';
import * as commonHelper from '../support/pages/common.page';
import { filtersTestSuite } from '../support/shared/filters.shared';

describe('Backlog', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-3/backlog');
        cy.waitLoader();
        cy.takeNamedScreenshot('backlog', 'backlog');
    });

    describe('Create User Story', () => {
        let createUSLightbox: ReturnType<typeof backlogHelper.getCreateEditUsLightbox>;

        before(() => {
            backlogHelper.openNewUs();
            createUSLightbox = backlogHelper.getCreateEditUsLightbox();
            createUSLightbox.waitOpen();
        });

        it('should capture create US screen', () => {
            cy.takeNamedScreenshot('backlog', 'create-us');
        });

        it('should fill the form', () => {
            // Subject
            createUSLightbox.subject().type('New User Story Subject');

            // Roles/Points
            createUSLightbox.setRole(1, 3);
            createUSLightbox.setRole(3, 4);
            createUSLightbox.getRolePoints().should('eq', '3');

            // Status
            createUSLightbox.status(2).click();

            // Tags
            commonHelper.tags();

            // Description
            createUSLightbox.description().type('Test description');

            // Settings
            createUSLightbox.settings(0).click();
        });

        it('should capture filled form', () => {
            cy.takeNamedScreenshot('backlog', 'create-us-filled');
        });

        it('should submit and create US', () => {
            backlogHelper.userStories().its('length').then((usCount) => {
                createUSLightbox.submit();
                cy.waitLightboxClose(createUSLightbox.el);

                backlogHelper.userStories().should('have.length', usCount + 1);
            });
        });
    });

    describe('Bulk Create User Stories', () => {
        let createUSLightbox: ReturnType<typeof backlogHelper.getBulkCreateLightbox>;

        before(() => {
            backlogHelper.openBulk();
            createUSLightbox = backlogHelper.getBulkCreateLightbox();
            createUSLightbox.waitOpen();
        });

        it('should fill bulk form', () => {
            createUSLightbox.textarea().type('Bulk Story 1{enter}Bulk Story 2{enter}');
        });

        it('should create multiple user stories', () => {
            backlogHelper.userStories().its('length').then((usCount) => {
                createUSLightbox.submit();
                createUSLightbox.waitClose();

                backlogHelper.userStories().should('have.length', usCount + 2);
            });
        });
    });

    describe('Edit User Story', () => {
        let editUSLightbox: ReturnType<typeof backlogHelper.getCreateEditUsLightbox>;

        before(() => {
            backlogHelper.openUsBacklogEdit(0);
            editUSLightbox = backlogHelper.getCreateEditUsLightbox();
            editUSLightbox.waitOpen();
        });

        it('should fill edit form', () => {
            editUSLightbox.subject().type('edited');

            editUSLightbox.setRole(0, 3);
            editUSLightbox.setRole(1, 3);
            editUSLightbox.setRole(2, 3);
            editUSLightbox.setRole(3, 3);

            editUSLightbox.getRolePoints().should('eq', '4');

            editUSLightbox.status(3).click();
            editUSLightbox.tags();
            editUSLightbox.description().type(' additional text');
            editUSLightbox.settings(1).click();
        });

        it('should save changes', () => {
            editUSLightbox.submit();
            editUSLightbox.waitClose();
        });
    });

    it('should edit status inline', () => {
        backlogHelper.setUsStatus(0, 1);
        cy.wait(2000); // Debounce

        backlogHelper.setUsStatus(0, 2).then((statusText) => {
            expect(statusText).to.contain('In progress');
        });
    });

    it('should edit points inline', () => {
        backlogHelper.getUsPoints(0).then((originalPoints) => {
            backlogHelper.setUsPoints(0, 1, 1);

            backlogHelper.getUsPoints(0).should('not.eq', originalPoints);
        });
    });

    it('should delete user story', () => {
        backlogHelper.userStories().its('length').then((usCount) => {
            backlogHelper.deleteUs(0);
            cy.confirmOk();

            backlogHelper.userStories().should('have.length', usCount - 1);
        });
    });

    it('should drag and reorder user stories', () => {
        backlogHelper.userStories().eq(4).find('span[tg-bo-ref]').invoke('text').then((draggedRef) => {
            cy.get('.backlog-table-body > div[ng-repeat]').eq(4).find('.icon-drag')
                .dragTo('.backlog-table-body > div[ng-repeat]:first');

            cy.wait(500);

            backlogHelper.userStories().first().find('span[tg-bo-ref]').invoke('text')
                .should('eq', draggedRef);
        });
    });

    describe('Milestones/Sprints', () => {
        it('should create a new sprint', () => {
            backlogHelper.openNewMilestone();

            const createMilestoneLightbox = backlogHelper.getCreateEditMilestone();
            createMilestoneLightbox.waitOpen();

            cy.takeNamedScreenshot('backlog', 'create-milestone');

            const sprintName = `Sprint-${Date.now()}`;
            createMilestoneLightbox.name().type(sprintName);
            createMilestoneLightbox.submit();

            cy.wait(2000);

            backlogHelper.getSprintsTitles().should('contain', sprintName);
        });

        it('should edit a sprint', () => {
            backlogHelper.openMilestoneEdit(0);

            const editMilestoneLightbox = backlogHelper.getCreateEditMilestone();
            editMilestoneLightbox.waitOpen();

            editMilestoneLightbox.name().clear();

            const newSprintName = `EditedSprint-${Date.now()}`;
            editMilestoneLightbox.name().type(newSprintName);
            editMilestoneLightbox.submit();
            editMilestoneLightbox.waitClose();

            backlogHelper.getSprintsTitles().should('contain', newSprintName);
        });

        it('should delete a sprint', () => {
            backlogHelper.openMilestoneEdit(0);

            const deleteMilestoneLightbox = backlogHelper.getCreateEditMilestone();
            deleteMilestoneLightbox.waitOpen();

            deleteMilestoneLightbox.delete();
            cy.confirmOk();
        });
    });

    describe('Tags', () => {
        it('should show tags', () => {
            cy.get('#show-tags').click();
            cy.takeNamedScreenshot('backlog', 'backlog-tags');
            cy.get('.backlog-table .tag').first().should('be.visible');
        });

        it('should hide tags', () => {
            cy.get('#show-tags').click();
            cy.get('.backlog-table .tag').first().should('not.be.visible');
        });
    });

    describe('Velocity Forecasting', () => {
        before(() => {
            cy.visit('/project/project-1/backlog');
            cy.waitLoader();
        });

        it('should show velocity forecasting', () => {
            backlogHelper.userStories().its('length').then((usCount) => {
                backlogHelper.openVelocityForecasting();
                cy.takeNamedScreenshot('backlog', 'velocity-forecasting');

                backlogHelper.userStories().its('length').should('be.below', usCount);
            });
        });
    });

    // Include shared filters test suite
    filtersTestSuite('backlog', () => backlogHelper.userStories().its('length'));
});
