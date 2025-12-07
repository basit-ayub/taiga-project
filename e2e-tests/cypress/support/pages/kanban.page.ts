/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Kanban Page Object
 * Converted from: e2e/helpers/kanban-helper.js
 */

// ================================
// Columns & User Stories
// ================================

export const getColumns = () => cy.get('.task-column');

export const getUss = () => cy.get('.kanban-userstory');

export const getBoxUss = (columnIndex: number) => {
    return cy.get('.task-column').eq(columnIndex).find('.kanban-userstory');
};

export const getColumnUssTitles = (columnIndex: number) => {
    return cy.get('.task-column').eq(columnIndex).find('.card-title').invoke('text');
};

// ================================
// Actions
// ================================

export const openNewUsLb = (columnIndex: number) => {
    cy.get('.task-column').eq(columnIndex).find('.add-action').click();
};

export const openBulkUsLb = (columnIndex: number) => {
    cy.get('.task-column').eq(columnIndex).find('.bulk-action').click();
};

export const editUs = (columnIndex: number, usIndex: number) => {
    cy.get('.task-column').eq(columnIndex).find('.kanban-userstory').eq(usIndex).find('.e2e-edit').click();
};

// ================================
// Zoom
// ================================

export const zoom = (level: number) => {
    cy.get('.zoom-level').eq(level - 1).click();
};

// ================================
// Fold/Unfold Columns
// ================================

export const foldColumn = (columnIndex: number) => {
    cy.get('.task-column').eq(columnIndex).find('.e2e-fold').click();
};

export const unFoldColumn = (columnIndex: number) => {
    cy.get('.vfold.task-column').eq(columnIndex).click();
};

// ================================
// Scroll
// ================================

export const scrollRight = () => {
    cy.get('.kanban-table').scrollTo('right');
};

export const scrollLeft = () => {
    cy.get('.kanban-table').scrollTo('left');
};

// ================================
// Watchers
// ================================

export const watchersLinks = () => cy.get('.card-owner');
