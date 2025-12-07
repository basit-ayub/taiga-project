/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Admin Attributes Page Object
 * Converted from: e2e/helpers/admin-attributes-helper.js
 */

// ================================
// Attribute Rows
// ================================

export const getRows = (type: string) => {
    return cy.get(`.${type}-table .attribute-row`);
};

export const getRow = (type: string, index: number) => {
    return cy.get(`.${type}-table .attribute-row`).eq(index);
};

// ================================
// Create New Attribute
// ================================

export const openCreate = (type: string) => {
    cy.get(`.${type}-table .add-button`).click();
};

export const fillNewAttribute = (name: string) => {
    cy.get('.attribute-row.new-value input[name="name"]').type(name);
};

export const submitNew = () => {
    cy.get('.attribute-row.new-value button[type="submit"]').click();
};

export const cancelNew = () => {
    cy.get('.attribute-row.new-value .e2e-cancel').click();
};

// ================================
// Edit Attribute
// ================================

export const openEdit = (type: string, index: number) => {
    cy.get(`.${type}-table .attribute-row`).eq(index).find('.e2e-edit').click();
};

export const editName = (newName: string) => {
    cy.get('.editing input[name="name"]').clear().type(newName);
};

export const submitEdit = () => {
    cy.get('.editing button[type="submit"]').click();
};

export const cancelEdit = () => {
    cy.get('.editing .e2e-cancel').click();
};

// ================================
// Delete Attribute
// ================================

export const deleteAttribute = (type: string, index: number) => {
    cy.get(`.${type}-table .attribute-row`).eq(index).find('.e2e-delete').click();
    cy.confirmOk();
};

// ================================
// Drag Reorder
// ================================

export const dragAttribute = (type: string, fromIndex: number, toIndex: number) => {
    const fromSelector = `.${type}-table .attribute-row:nth-child(${fromIndex + 1}) .e2e-drag`;
    const toSelector = `.${type}-table .attribute-row:nth-child(${toIndex + 1})`;

    cy.get(fromSelector).dragTo(toSelector);
};

// ================================
// Get Attribute Name
// ================================

export const getAttributeName = (type: string, index: number) => {
    return cy.get(`.${type}-table .attribute-row`).eq(index).find('.attribute-name').invoke('text');
};

// ================================
// Status Specific
// ================================

export const toggleStatusArchived = (type: string, index: number) => {
    cy.get(`.${type}-table .attribute-row`).eq(index).find('.e2e-archive').click();
};

export const isStatusArchived = (type: string, index: number) => {
    return cy.get(`.${type}-table .attribute-row`).eq(index).invoke('hasClass', 'archived');
};
