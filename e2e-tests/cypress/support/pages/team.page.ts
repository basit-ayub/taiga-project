/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Team Page Object
 * Converted from: e2e/helpers/team-helper.js
 */

// ================================
// Team Members
// ================================

export const getMembers = () => cy.get('.team-member');

export const getMember = (index: number) => cy.get('.team-member').eq(index);

export const getMemberName = (index: number) => {
    return cy.get('.team-member').eq(index).find('.member-name').invoke('text');
};

export const getMemberRole = (index: number) => {
    return cy.get('.team-member').eq(index).find('.member-role').invoke('text');
};

// ================================
// Member Actions
// ================================

export const clickMember = (index: number) => {
    cy.get('.team-member').eq(index).click();
    cy.waitLoader();
};

export const hoverMember = (index: number) => {
    cy.get('.team-member').eq(index).trigger('mouseenter');
};

// ================================
// Stats
// ================================

export const getOpenClosedStat = () => {
    return cy.get('.open-closed-stats').invoke('text');
};

// ================================
// Leave Project
// ================================

export const leaveProject = () => {
    cy.get('.leave-project').click();
    cy.confirmOk();
};

// ================================
// Filters
// ================================

export const filterByRole = (roleIndex: number) => {
    cy.get('.role-filter').openPopover(roleIndex);
};

export const clearRoleFilter = () => {
    cy.get('.clear-role-filter').click();
};
