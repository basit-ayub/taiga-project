/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Issues Page Object
 * Converted from: e2e/helpers/issues-helper.js
 */

// ================================
// Create Issue Lightbox
// ================================

export const getCreateIssueLightbox = () => {
    const el = 'div[tg-lb-create-issue]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        subject: () => cy.get(`${el} input`).first(),
        tags: () => cy.get(`${el} .tag-input`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

// ================================
// Bulk Create Lightbox
// ================================

export const getBulkCreateLightbox = () => {
    const el = 'div[tg-lb-create-bulk-issues]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        textarea: () => cy.get(`${el} textarea`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

// ================================
// Issues List
// ================================

export const getIssues = () => cy.get('.row.table-main');

export const getTable = () => cy.get('.basic-table');

export const clickColumn = (index: number) => {
    cy.get('.row.title > div').eq(index).click();
};

export const getStatus = () => cy.get('.issue-status').invoke('text');

export const getAssignTo = (index: number) => {
    return cy.get('.assigned-field figcaption').eq(index).invoke('text');
};

// ================================
// Actions
// ================================

export const openNewIssueLb = () => {
    cy.get('.new-issue .button-green').click();
};

export const openBulk = () => {
    cy.get('.new-issue .button-bulk').click();
};

export const openAssignTo = (index: number) => {
    cy.get('.issue-assignedto').eq(index).click();
};

export const changeStatus = (index: number, statusIndex: number) => {
    return cy.get('.issue-status').eq(index).openPopover(statusIndex);
};

// ================================
// Pagination
// ================================

export const clickPagination = (index: number) => {
    cy.get('.paginator li').eq(index).click();
};

// ================================
// Parsing
// ================================

export const parseIssue = (element: JQuery<HTMLElement>) => {
    const ref = Cypress.$(element).find('.subject span').eq(0).text().replace('#', '');
    const subject = Cypress.$(element).find('.subject span').eq(1).text();

    return { ref, subject };
};
