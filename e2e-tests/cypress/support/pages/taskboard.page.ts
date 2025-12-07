/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Taskboard Page Object
 * Converted from: e2e/helpers/taskboard-helper.js
 */

// ================================
// Columns
// ================================

export const getColumns = () => cy.get('.taskboard-column');

export const getColumn = (index: number) => cy.get('.taskboard-column').eq(index);

// ================================
// Tasks
// ================================

export const getTasks = () => cy.get('tg-card');

export const getTasksInColumn = (columnIndex: number) => {
    return cy.get('.taskboard-column').eq(columnIndex).find('tg-card');
};

export const getTaskTitle = (columnIndex: number, taskIndex: number) => {
    return cy.get('.taskboard-column').eq(columnIndex)
        .find('tg-card').eq(taskIndex)
        .find('.card-title').invoke('text');
};

// ================================
// Create Task
// ================================

export const openNewTaskLb = (columnIndex: number) => {
    cy.get('.taskboard-column').eq(columnIndex).find('.add-action').click();
};

export const openBulkTaskLb = (columnIndex: number) => {
    cy.get('.taskboard-column').eq(columnIndex).find('.bulk-action').click();
};

export const getCreateTaskLightbox = () => {
    const el = 'div[tg-lb-create-edit-task]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        subject: () => cy.get(`${el} input[name="subject"]`),
        description: () => cy.get(`${el} textarea[name="description"]`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

export const getBulkCreateLightbox = () => {
    const el = 'div[tg-lb-create-bulk-tasks]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        textarea: () => cy.get(`${el} textarea`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

// ================================
// Edit Task
// ================================

export const openEditTask = (columnIndex: number, taskIndex: number) => {
    cy.get('.taskboard-column').eq(columnIndex)
        .find('tg-card').eq(taskIndex)
        .find('.e2e-edit').click();
};

// ================================
// Task Actions
// ================================

export const clickTask = (columnIndex: number, taskIndex: number) => {
    cy.get('.taskboard-column').eq(columnIndex)
        .find('tg-card').eq(taskIndex)
        .find('.card-title a').click();
    cy.waitLoader();
};

// ================================
// Fold/Unfold
// ================================

export const foldRow = (rowIndex: number) => {
    cy.get('.taskboard-row').eq(rowIndex).find('.e2e-fold').click();
};

export const unfoldRow = (rowIndex: number) => {
    cy.get('.taskboard-row.folded').eq(rowIndex).click();
};

// ================================
// Zoom
// ================================

export const zoom = (level: number) => {
    cy.get('.zoom-level').eq(level - 1).click();
};

// ================================
// User Story Rows
// ================================

export const getUsRows = () => cy.get('.taskboard-row');

export const getUsRow = (index: number) => cy.get('.taskboard-row').eq(index);

export const getUsRowTitle = (index: number) => {
    return cy.get('.taskboard-row').eq(index).find('.us-title').invoke('text');
};
