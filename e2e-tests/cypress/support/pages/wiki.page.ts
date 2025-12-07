/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Wiki Page Object
 * Converted from: e2e/helpers/wiki-helper.js
 */

// ================================
// Wiki Navigation
// ================================

export const getLinks = () => cy.get('.wiki-nav-item');

export const getLink = (index: number) => cy.get('.wiki-nav-item').eq(index);

export const clickLink = (index: number) => {
    cy.get('.wiki-nav-item').eq(index).click();
    cy.waitLoader();
};

// ================================
// Wiki Content
// ================================

export const getTitle = () => cy.get('.wiki-title').invoke('text');

export const getContent = () => cy.get('.wiki-content').invoke('text');

// ================================
// Create/Edit Wiki
// ================================

export const openNewPage = () => {
    cy.get('.add-wiki-page').click();
};

export const getNewPageLightbox = () => {
    const el = 'div[tg-lb-create-wiki-page]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        slug: () => cy.get(`${el} input[name="slug"]`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

// ================================
// Edit Mode
// ================================

export const enableEditMode = () => {
    cy.get('.e2e-edit-wiki').click();
};

export const getWysiwygTextarea = () => cy.get('.wiki-content-wrapper textarea');

export const saveChanges = () => {
    cy.get('.save-wiki').click();
    cy.waitNotificationSuccess();
};

export const cancelEdit = () => {
    cy.get('.cancel-edit').click();
};

// ================================
// Delete Wiki
// ================================

export const deletePage = () => {
    cy.get('.delete-wiki-page').click();
    cy.confirmOk();
};

// ================================
// Wiki Link Management
// ================================

export const openLinkOptions = (index: number) => {
    cy.get('.wiki-nav-item').eq(index).find('.e2e-options').click();
};

export const deleteLink = (index: number) => {
    openLinkOptions(index);
    cy.get('.wiki-nav-item').eq(index).find('.e2e-delete').click();
    cy.confirmOk();
};

export const renameLink = (index: number, newName: string) => {
    openLinkOptions(index);
    cy.get('.wiki-nav-item').eq(index).find('.e2e-rename').click();
    cy.get('.wiki-nav-item').eq(index).find('input').clear().type(`${newName}{enter}`);
};

// ================================
// Drag Reorder Links
// ================================

export const dragLink = (fromIndex: number, toIndex: number) => {
    const fromSelector = `.wiki-nav-item:nth-child(${fromIndex + 1}) .e2e-drag`;
    const toSelector = `.wiki-nav-item:nth-child(${toIndex + 1})`;

    cy.get(fromSelector).dragTo(toSelector);
};
