/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Common Page Object - Shared helpers
 * Converted from: e2e/helpers/common-helper.js
 */

// ================================
// Assign To Lightbox
// ================================

export const assignToLightbox = () => {
    const el = 'div[tg-lb-assignedto]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        close: () => cy.get(`${el} .close`).first().click(),
        selectFirst: () => cy.get(`${el} div[data-user-id]`).first().click(),
        select: (index: number) => cy.get(`${el} div[data-user-id]`).eq(index).click(),
        getName: (item: number) => cy.get(`${el} div[data-user-id] .user-list-name`).eq(item).invoke('text'),
        getNames: () => cy.get(`${el} .user-list-name`).invoke('text'),
        filter: (text: string) => cy.get(`${el} input`).type(text),
        userList: () => cy.get(`${el} .user-list-single`),
    };
};

// ================================
// Lightbox Attachment
// ================================

export const lightboxAttachment = () => {
    const el = 'tg-attachments-simple';

    cy.get(`${el} .single-attachment`).then(($attachments) => {
        const countBefore = $attachments.length;

        // Upload image
        cy.fixture('upload-image-test.png', 'base64').then((fileContent) => {
            cy.get(`${el} #add-attach`).then(($input) => {
                cy.wrap($input).invoke('show').invoke('removeClass', 'hidden');
                cy.wrap($input).selectFile({
                    contents: Cypress.Buffer.from(fileContent, 'base64'),
                    fileName: 'upload-image-test.png',
                    mimeType: 'image/png',
                }, { force: true });
            });
        });

        // Upload file
        cy.fixture('upload-file-test.txt').then((fileContent) => {
            cy.get(`${el} #add-attach`).then(($input) => {
                cy.wrap($input).invoke('show').invoke('removeClass', 'hidden');
                cy.wrap($input).selectFile({
                    contents: Cypress.Buffer.from(fileContent),
                    fileName: 'upload-file-test.txt',
                    mimeType: 'text/plain',
                }, { force: true });
            });
        });

        // Delete one attachment
        cy.get(`${el} .attachment-delete`).first().click();

        // Verify count
        cy.get(`${el} .single-attachment`).should('have.length', countBefore + 1);
    });
};

// ================================
// Tags
// ================================

export const tags = () => {
    cy.get('.e2e-show-tag-input').click();
    cy.get('.e2e-open-color-selector').click();
    cy.get('.e2e-color-dropdown li').eq(1).click();
    cy.get('.e2e-add-tag-input').type('xxxyy{enter}');
    cy.get('.e2e-delete-tag').last().click();
    cy.get('.e2e-add-tag-input').type('a{downarrow}{enter}');
};
