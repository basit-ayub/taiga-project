/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Wiki E2E Tests
 * Converted from: e2e/suites/wiki.e2e.js
 */

import * as wikiHelper from '../support/pages/wiki.page';

describe('Wiki', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/wiki/home');
        cy.waitLoader();
        cy.takeNamedScreenshot('wiki', 'wiki');
    });

    it('should display wiki links', () => {
        wikiHelper.getLinks().should('have.length.above', 0);
    });

    describe('Create Wiki Page', () => {
        it('should open create page lightbox', () => {
            wikiHelper.openNewPage();
            const lightbox = wikiHelper.getNewPageLightbox();
            lightbox.waitOpen();
            cy.takeNamedScreenshot('wiki', 'create-page');
        });

        it('should create new page', () => {
            const lightbox = wikiHelper.getNewPageLightbox();
            const pageName = `Test-Page-${Date.now()}`;

            lightbox.slug().type(pageName);
            lightbox.submit();
            lightbox.waitClose();

            cy.waitLoader();
            cy.url().should('include', pageName.toLowerCase());
        });
    });

    describe('Edit Wiki Page', () => {
        before(() => {
            cy.visit('/project/project-0/wiki/home');
            cy.waitLoader();
        });

        it('should enable edit mode', () => {
            wikiHelper.enableEditMode();
            wikiHelper.getWysiwygTextarea().should('be.visible');
        });

        it('should edit and save content', () => {
            const newContent = `\nEdited content ${Date.now()}`;
            wikiHelper.getWysiwygTextarea().type(newContent);
            wikiHelper.saveChanges();

            wikiHelper.getContent().should('contain', `Edited content`);
        });
    });

    describe('Wiki Links Management', () => {
        before(() => {
            cy.visit('/project/project-0/wiki/home');
            cy.waitLoader();
        });

        it('should drag reorder links', () => {
            wikiHelper.getLinks().its('length').then((count) => {
                if (count > 1) {
                    wikiHelper.dragLink(1, 0);
                    cy.wait(500);
                }
            });
        });
    });
});
