/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Backlog Page Object
 * Converted from: e2e/helpers/backlog-helper.js
 */

// ================================
// User Stories
// ================================

export const userStories = () => cy.get('.backlog-table-body > div[ng-repeat]');

export const selectedUserStories = () => cy.get('.backlog-table-body input[type="checkbox"]:checked');

export const getUsRef = (element: Cypress.Chainable<JQuery<HTMLElement>>) => {
    return element.find('span[tg-bo-ref]').invoke('text');
};

export const getUsPoints = (item: number) => {
    return cy.get('.backlog-table-body > div .us-points').eq(item).find('span').first().invoke('text');
};

export const setUsStatus = (item: number, value: number) => {
    cy.get('.backlog-table-body > div .us-status').eq(item).openPopover(value);
    return cy.get('.backlog-table-body > div .us-status').eq(item).find('span').first().invoke('text');
};

export const setUsPoints = (item: number, value1: number, value2: number) => {
    return cy.get('.backlog-table-body > div .us-points').eq(item).find('span').first().openPopover(value1, value2);
};

export const deleteUs = (item: number) => {
    cy.get('.backlog-table-body > div .e2e-delete').eq(item).click();
};

export const loadFullBacklog = () => {
    const scrollToLast = () => {
        cy.get('.backlog-table-body > div[ng-repeat]').then(($items) => {
            const count = $items.length;
            cy.wrap($items.last()).scrollIntoView();
            cy.wait(500);
            cy.get('.backlog-table-body > div[ng-repeat]').then(($newItems) => {
                if ($newItems.length > count) {
                    scrollToLast();
                }
            });
        });
    };
    scrollToLast();
};

// ================================
// Create/Edit US Lightbox
// ================================

export const getCreateEditUsLightbox = () => {
    const el = 'div[tg-lb-create-edit-userstory]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        roles: () => cy.get(`${el} .points-per-role li`),
        subject: () => cy.get(`${el} input[name="subject"]`),
        description: () => cy.get(`${el} textarea[name="description"]`),
        status: (item: number) => cy.get(`${el} select option:nth-child(${item})`),
        settings: (item: number) => cy.get(`${el} .settings label`).eq(item),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
        setRole: (roleItem: number, value: number) => {
            return cy.get(`${el} .points-per-role li`).eq(roleItem).openPopover(value);
        },
        getRolePoints: () => cy.get(`${el} .ticket-role-points`).last().find('.points').invoke('text'),
        tags: () => {
            cy.get('.e2e-show-tag-input').click();
            cy.get('.e2e-open-color-selector').click();
            cy.get('.e2e-color-dropdown li').eq(1).click();
            cy.get('.e2e-add-tag-input').type('xxxyy{enter}');
            cy.get('.e2e-delete-tag').last().click();
            cy.get('.e2e-add-tag-input').type('a{downarrow}{enter}');
        },
    };
};

// ================================
// Bulk Create Lightbox
// ================================

export const getBulkCreateLightbox = () => {
    const el = 'div[tg-lb-create-bulk-userstories]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        textarea: () => cy.get(`${el} textarea`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
    };
};

// ================================
// Sprints/Milestones
// ================================

export const sprints = () => cy.get('div[tg-backlog-sprint="sprint"]');

export const sprintsOpen = () => cy.get('div[tg-backlog-sprint="sprint"].sprint-open');

export const closedSprints = () => cy.get('.sprint-closed');

export const getSprintUserstories = (sprintElement: Cypress.Chainable<JQuery<HTMLElement>>) => {
    return sprintElement.find('.milestone-us-item-row');
};

export const getSprintsRefs = (sprintElement: Cypress.Chainable<JQuery<HTMLElement>>) => {
    return sprintElement.find('span[tg-bo-ref]').invoke('text');
};

export const getSprintsTitles = () => cy.get('div[tg-backlog-sprint="sprint"] .sprint-name span').invoke('text');

export const toggleClosedSprints = () => cy.get('.filter-closed-sprints').click();

export const toggleSprint = (sprintElement: Cypress.Chainable<JQuery<HTMLElement>>) => {
    sprintElement.find('.compact-sprint').click();
    sprintElement.find('.sprint-table').waitTransition();
};

export const getClosedSprintTable = () => cy.get('.sprint-empty').last();

// ================================
// Create/Edit Milestone Lightbox
// ================================

export const getCreateEditMilestone = () => {
    const el = 'div[tg-lb-create-edit-sprint]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        name: () => cy.get(`${el} input[ng-model="sprint.name"]`),
        submit: () => cy.get(`${el} button[type="submit"]`).click(),
        delete: () => cy.get(`${el} .delete-sprint`).click(),
    };
};

// ================================
// Actions
// ================================

export const openNewUs = () => cy.get('.new-us a').first().click();

export const openBulk = () => cy.get('.new-us a').eq(1).click();

export const openUsBacklogEdit = (item: number) => cy.get('.backlog-table-body .e2e-edit').eq(item).click();

export const openMilestoneEdit = (item: number) => cy.get('div[tg-backlog-sprint="sprint"] .edit-sprint').eq(item).click();

export const openNewMilestone = () => cy.get('.add-sprint').click();

// ================================
// Velocity Forecasting
// ================================

export const velocityForecasting = () => cy.get('.e2e-velocity-forecasting');

export const openVelocityForecasting = () => cy.get('.e2e-velocity-forecasting').click();

export const createSprintFromForecasting = () => {
    cy.get('.e2e-velocity-forecasting-add').click();
    const sprintName = `sprintName${Date.now()}`;
    cy.get('.e2e-sprint-name').type(`${sprintName}{enter}`);
};

// ================================
// Filters
// ================================

export const filterRole = (value: number) => {
    return cy.get('div[tg-us-role-points-selector]').openPopover(value);
};

export const goBackFilters = () => cy.get('.filters-step-cat .breadcrumb a').first().click();

// ================================
// Testing Helpers
// ================================

export const getTestingFilterRef = () => {
    return userStories().then(($items) => {
        let longestRef = '';
        const refs: string[] = [];

        $items.each((i, item) => {
            const ref = Cypress.$(item).find('span[tg-bo-ref]').text();
            refs.push(ref);
            if (ref.length > longestRef.length) {
                longestRef = ref;
            }
        });

        return longestRef;
    });
};
