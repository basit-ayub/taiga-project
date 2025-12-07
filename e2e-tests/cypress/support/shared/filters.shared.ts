/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Shared Filters Test Functions
 * Converted from: e2e/shared/filters.js
 */

import * as filterHelper from '../pages/filters.page';

export const filtersTestSuite = (name: string, counter: () => Cypress.Chainable<number>) => {
    describe(`${name} filters`, () => {
        before(() => {
            filterHelper.open();
            cy.wait(4000);
            cy.takeNamedScreenshot(name, 'filters');
        });

        it('filter by ref', () => {
            filterHelper.byText('xxxxyy123123123');

            counter().then((len) => {
                filterHelper.clearFilters();
                expect(len).to.equal(0);
            });
        });

        it('filter by category', () => {
            counter().then((originalLen) => {
                filterHelper.filterByCategoryWithContent();

                counter().then((newLength) => {
                    expect(originalLen).to.be.above(newLength);

                    filterHelper.clearFilters();

                    counter().then((restoredLen) => {
                        expect(originalLen).to.equal(restoredLen);
                    });
                });
            });
        });

        it('save custom filters', () => {
            filterHelper.getCustomFilters().its('length').then((customFiltersSize) => {
                filterHelper.filterByCategoryWithContent();
                filterHelper.saveFilter('custom-filter');
                filterHelper.clearFilters();

                filterHelper.getCustomFilters().should('have.length', customFiltersSize + 1);
            });
        });

        it('remove custom filters', () => {
            filterHelper.openCustomFiltersCategory();

            filterHelper.getCustomFilters().its('length').then((customFiltersSize) => {
                filterHelper.removeLastCustomFilter();

                filterHelper.getCustomFilters().should('have.length', customFiltersSize - 1);
            });
        });

        after(() => {
            filterHelper.clearFilters();
        });
    });
};
