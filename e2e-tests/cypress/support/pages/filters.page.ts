/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Filters Page Object
 * Converted from: e2e/helpers/filters-helper.js
 */

// ================================
// Filter Element
// ================================

export const getFilter = () => cy.get('tg-filter');

// ================================
// Open/Close Filters
// ================================

export const open = () => {
    cy.get('body').then(($body) => {
        if ($body.find('.e2e-open-filter').length > 0) {
            cy.get('.e2e-open-filter').click();
            cy.wait(500); // Wait for transition
        }
    });
};

// ================================
// Filter Actions
// ================================

export const byText = (text: string) => {
    return cy.get('.e2e-filter-q').type(text);
};

export const clearByTextInput = () => {
    return cy.get('.e2e-filter-q').clear();
};

export const clearFilters = () => {
    cy.get('.e2e-remove-filter').each(($filter) => {
        cy.wrap($filter).click();
    });
    clearByTextInput();
    cy.get('body').then(($body) => {
        if ($body.find('.e2e-category.selected').length > 0) {
            cy.get('.e2e-category.selected').click();
        }
    });
};

// ================================
// Filter Counters & Custom Filters
// ================================

export const getFiltersCounters = () => cy.get('.e2e-filter-count');

export const getCustomFilters = () => cy.get('.e2e-custom-filter');

export const filterByLastCustomFilter = () => {
    openCustomFiltersCategory();
    cy.get('.e2e-custom-filter').last().click();
};

export const openCustomFiltersCategory = () => {
    cy.get('.e2e-custom-filters').click();
};

export const removeLastCustomFilter = () => {
    cy.get('.e2e-remove-custom-filter').last().click();
};

// ================================
// Filter By Category
// ================================

export const filterByCategoryWithContent = () => {
    cy.get('.e2e-category').first().click();
    cy.get('.e2e-filter-count').first().parent().click();
};

// ================================
// Save Filter
// ================================

export const saveFilter = (name: string) => {
    cy.get('.e2e-open-custom-filter-form').click();
    cy.get('.e2e-filter-name-input').type(`${name}{enter}`);
};
