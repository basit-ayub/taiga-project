/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Admin Memberships Page Object
 * Converted from: e2e/helpers/admin-memberships.js
 */

// ================================
// Member Rows
// ================================

export const getMembers = () => cy.get('.member-row');

export const getMember = (index: number) => cy.get('.member-row').eq(index);

export const getMemberName = (index: number) => {
    return cy.get('.member-row').eq(index).find('.member-name').invoke('text');
};

// ================================
// New Member Lightbox
// ================================

export const openNewMemberLightbox = () => {
    cy.get('.add-member-button').click();
};

export const getNewMemberLightbox = () => {
    const el = 'div[tg-lb-add-members]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        newEmail: (email: string) => cy.get(`${el} .new-member-email`).type(email),
        setRole: (roleIndex: number) => cy.get(`${el} .role-selector`).eq(roleIndex).click(),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
        close: () => cy.get(`${el} .close`).click(),
    };
};

// ================================
// Edit Member
// ================================

export const openEditMember = (index: number) => {
    cy.get('.member-row').eq(index).find('.e2e-edit').click();
};

export const changeRole = (memberIndex: number, roleIndex: number) => {
    cy.get('.member-row').eq(memberIndex).find('.role-selector').openPopover(roleIndex);
};

// ================================
// Delete Member
// ================================

export const deleteMember = (index: number) => {
    cy.get('.member-row').eq(index).find('.e2e-delete').click();
    cy.confirmOk();
};

// ================================
// Admin Status
// ================================

export const toggleAdmin = (index: number) => {
    cy.get('.member-row').eq(index).find('.e2e-admin-toggle').click();
};

export const isAdmin = (index: number) => {
    return cy.get('.member-row').eq(index).find('.e2e-admin-toggle').invoke('hasClass', 'active');
};

// ================================
// Leave Project
// ================================

export const leaveProject = () => {
    cy.get('.leave-project-button').click();
    cy.confirmOk();
};

// ================================
// Pending Invitations
// ================================

export const getPendingInvitations = () => cy.get('.pending-member-row');

export const resendInvitation = (index: number) => {
    cy.get('.pending-member-row').eq(index).find('.e2e-resend').click();
};

export const cancelInvitation = (index: number) => {
    cy.get('.pending-member-row').eq(index).find('.e2e-cancel').click();
    cy.confirmOk();
};
