/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Issues List E2E Tests
 * Converted from: e2e/suites/issues/issues.e2e.js
 */

import * as issuesHelper from '../../support/pages/issues.page';
import * as commonHelper from '../../support/pages/common.page';
import { filtersTestSuite } from '../../support/shared/filters.shared';

describe('Issues List', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-3/issues');
        cy.waitLoader();
        cy.takeNamedScreenshot('issues', 'issues');
    });

    describe('Create Issue', () => {
        let createIssueLightbox: ReturnType<typeof issuesHelper.getCreateIssueLightbox>;

        before(() => {
            issuesHelper.openNewIssueLb();
            createIssueLightbox = issuesHelper.getCreateIssueLightbox();
            createIssueLightbox.waitOpen();
        });

        it('should capture create issue screen', () => {
            cy.takeNamedScreenshot('issues', 'create-issue');
        });

        it('should fill the form', () => {
            createIssueLightbox.subject().type('New Issue Subject');
            commonHelper.tags();
        });

        it('should capture filled form', () => {
            cy.takeNamedScreenshot('issues', 'create-issue-filled');
        });

        it('should submit and create issue', () => {
            createIssueLightbox.submit();

            cy.waitNotificationSuccess();
            cy.waitNotificationSuccessClose();
        });
    });

    describe('Bulk Create Issues', () => {
        let createIssueLightbox: ReturnType<typeof issuesHelper.getBulkCreateLightbox>;

        before(() => {
            issuesHelper.openBulk();
            createIssueLightbox = issuesHelper.getBulkCreateLightbox();
            createIssueLightbox.waitOpen();
        });

        it('should fill bulk form', () => {
            createIssueLightbox.textarea().type('Bulk Issue 1{enter}Bulk Issue 2{enter}');
        });

        it('should create multiple issues', () => {
            createIssueLightbox.submit();
            createIssueLightbox.waitClose();

            cy.waitNotificationSuccess();
            cy.waitNotificationSuccessClose();
        });
    });

    it('should change column order', () => {
        // Test every column order
        for (let i = 0; i < 7; i++) {
            issuesHelper.clickColumn(i);
            cy.wait(500);
            issuesHelper.clickColumn(i);
            cy.wait(500);
        }
    });

    it('should assign issue to user', () => {
        const assignToLightbox = commonHelper.assignToLightbox();

        issuesHelper.openAssignTo(0);
        assignToLightbox.waitOpen();

        assignToLightbox.getName(2).then((newUserName) => {
            assignToLightbox.select(2);
            assignToLightbox.waitClose();

            issuesHelper.getAssignTo(0).should('eq', newUserName);
        });
    });

    it('should change issue status', () => {
        issuesHelper.getStatus().then((oldStatus) => {
            issuesHelper.changeStatus(0, 1);
            cy.wait(500);

            issuesHelper.changeStatus(1, 1);

            issuesHelper.getStatus().should('not.eq', oldStatus);
        });
    });

    // Include shared filters test suite
    filtersTestSuite('issues', () => issuesHelper.getIssues().its('length'));
});
