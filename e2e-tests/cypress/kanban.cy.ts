/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Kanban E2E Tests
 * Converted from: e2e/suites/kanban.e2e.js
 */

import * as kanbanHelper from '../support/pages/kanban.page';
import * as backlogHelper from '../support/pages/backlog.page';
import * as commonHelper from '../support/pages/common.page';
import { filtersTestSuite } from '../support/shared/filters.shared';

describe('Kanban', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/kanban');
        cy.waitLoader();
        cy.takeNamedScreenshot('kanban', 'kanban');
    });

    it('should zoom in/out', () => {
        kanbanHelper.zoom(1);
        cy.wait(1000);
        cy.takeNamedScreenshot('kanban', 'zoom1');

        kanbanHelper.zoom(2);
        cy.wait(1000);
        cy.takeNamedScreenshot('kanban', 'zoom2');

        kanbanHelper.zoom(3);
        cy.wait(1000);
        cy.takeNamedScreenshot('kanban', 'zoom3');

        kanbanHelper.zoom(4);
        cy.wait(1000);
        cy.takeNamedScreenshot('kanban', 'zoom4');
    });

    describe('Create User Story', () => {
        let createUSLightbox: ReturnType<typeof backlogHelper.getCreateEditUsLightbox>;
        const formFields = {
            subject: '',
            description: '',
        };

        before(() => {
            kanbanHelper.openNewUsLb(0);
            createUSLightbox = backlogHelper.getCreateEditUsLightbox();
            createUSLightbox.waitOpen();
        });

        it('should capture create US screen', () => {
            cy.takeNamedScreenshot('kanban', 'create-us');
        });

        it('should fill the form', () => {
            const date = Date.now();
            formFields.subject = `test subject ${date}`;
            formFields.description = `test description ${date}`;

            createUSLightbox.subject().type(formFields.subject);

            createUSLightbox.setRole(0, 3);
            createUSLightbox.setRole(1, 3);
            createUSLightbox.setRole(2, 3);
            createUSLightbox.setRole(3, 3);

            createUSLightbox.getRolePoints().should('eq', '4');

            commonHelper.tags();

            createUSLightbox.description().type(formFields.description);
            createUSLightbox.settings(1).click();
        });

        it('should capture filled form', () => {
            cy.takeNamedScreenshot('kanban', 'create-us-filled');
        });

        it('should submit and create US', () => {
            createUSLightbox.submit();
            cy.waitLightboxClose(createUSLightbox.el);

            kanbanHelper.getColumnUssTitles(0).should('contain', formFields.subject);
        });
    });

    describe('Edit User Story', () => {
        let editUSLightbox: ReturnType<typeof backlogHelper.getCreateEditUsLightbox>;
        const formFields = {
            subject: '',
            description: '',
        };

        before(() => {
            kanbanHelper.editUs(0, 0);
            editUSLightbox = backlogHelper.getCreateEditUsLightbox();
            editUSLightbox.waitOpen();
        });

        it('should capture edit US screen', () => {
            cy.takeNamedScreenshot('kanban', 'edit-us');
        });

        it('should fill the edit form', () => {
            const date = Date.now();
            formFields.subject = `edited subject ${date}`;
            formFields.description = `edited description ${date}`;

            editUSLightbox.subject().clear().type(formFields.subject);

            editUSLightbox.setRole(0, 3);
            editUSLightbox.setRole(1, 3);
            editUSLightbox.setRole(2, 3);
            editUSLightbox.setRole(3, 3);

            editUSLightbox.getRolePoints().should('eq', '4');

            editUSLightbox.tags();
            editUSLightbox.description().type(formFields.description);
            editUSLightbox.settings(1).click();
        });

        it('should save changes', () => {
            editUSLightbox.submit();
            cy.waitLightboxClose(editUSLightbox.el);

            kanbanHelper.getColumnUssTitles(0).should('contain', formFields.subject);
        });
    });

    describe('Bulk Create', () => {
        let createUSLightbox: ReturnType<typeof backlogHelper.getBulkCreateLightbox>;

        before(() => {
            kanbanHelper.openBulkUsLb(0);
            createUSLightbox = backlogHelper.getBulkCreateLightbox();
            createUSLightbox.waitOpen();
        });

        it('should fill bulk form', () => {
            createUSLightbox.textarea().type('Bulk US 1{enter}Bulk US 2{enter}');
        });

        it('should create multiple user stories', () => {
            kanbanHelper.getBoxUss(0).its('length').then((ussCount) => {
                createUSLightbox.submit();
                cy.waitLightboxClose(createUSLightbox.el);

                kanbanHelper.getBoxUss(0).should('have.length', ussCount + 2);
            });
        });
    });

    describe('Fold/Unfold Columns', () => {
        it('should fold column', () => {
            kanbanHelper.foldColumn(0);
            cy.takeNamedScreenshot('kanban', 'fold-column');

            cy.get('.vfold.task-column').should('have.length', 1);
        });

        it('should unfold column', () => {
            kanbanHelper.unFoldColumn(0);

            cy.get('.vfold.task-column').should('have.length', 0);
        });
    });

    it('should move US between columns', () => {
        kanbanHelper.getBoxUss(0).its('length').then((initOriginCount) => {
            kanbanHelper.getBoxUss(1).its('length').then((initDestCount) => {
                // Drag from column 0 to column 1
                cy.get('.task-column').eq(0).find('.kanban-userstory').first()
                    .dragTo('.task-column:nth-child(2)', 0, 10);

                cy.wait(500);

                kanbanHelper.getBoxUss(0).should('have.length', initOriginCount - 1);
                kanbanHelper.getBoxUss(1).should('have.length', initDestCount + 1);
            });
        });
    });

    describe('Archive', () => {
        it('should move US to archive', () => {
            kanbanHelper.getBoxUss(3).its('length').then((initOriginCount) => {
                kanbanHelper.scrollRight();

                cy.get('.task-column').eq(3).find('.kanban-userstory').first()
                    .dragTo('.task-column:last', 0, 10);

                cy.wait(500);
                cy.takeNamedScreenshot('kanban', 'archive');

                kanbanHelper.getBoxUss(3).should('have.length', initOriginCount - 1);
            });
        });
    });

    it('should edit assigned to', () => {
        kanbanHelper.watchersLinks().first().click();

        const lightbox = commonHelper.assignToLightbox();
        lightbox.waitOpen();

        lightbox.getName(0).then((assignedToName) => {
            lightbox.selectFirst();
            lightbox.waitClose();

            kanbanHelper.getBoxUss(0).first().find('.card-owner-name').invoke('text')
                .should('eq', assignedToName);
        });
    });

    // Include shared filters test suite
    filtersTestSuite('kanban', () => kanbanHelper.getUss().its('length'));
});
