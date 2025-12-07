/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Issue Detail E2E Tests
 * Converted from: e2e/suites/issues/issue-detail.e2e.js
 */

import * as detailHelper from '../../support/pages/detail.page';
import {
    titleTesting,
    tagsTesting,
    statusTesting,
    assignedToTesting,
    historyTesting,
    blockTesting,
    attachmentTesting,
    deleteTesting,
    watchersTesting,
} from '../../support/shared/detail.shared';

describe('Issue Detail', () => {
    beforeEach(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-3/issues');
        cy.waitLoader();
        cy.get('.row.table-main .subject a').first().click();
        cy.waitLoader();
        cy.takeNamedScreenshot('issue-detail', 'issue-detail');
    });

    it('should edit issue title', () => {
        titleTesting();
    });

    it('should manage issue tags', () => {
        tagsTesting();
    });

    it('should change issue status', () => {
        statusTesting('New', 'In progress');
    });

    describe('Assigned To', () => {
        assignedToTesting();
    });

    it('should show history/activity', () => {
        historyTesting('issue-detail');
    });

    it('should block and unblock issue', () => {
        blockTesting();
    });

    it('should manage attachments', () => {
        attachmentTesting();
    });

    describe('Watchers', () => {
        watchersTesting();
    });

    it('should delete issue', () => {
        deleteTesting();
        cy.url().should('include', '/issues');
    });
});
