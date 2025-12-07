/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Shared Detail Test Functions
 * Converted from: e2e/shared/detail.js
 */

import * as detailHelper from '../pages/detail.page';
import * as commonHelper from '../pages/common.page';

// ================================
// Title Testing
// ================================

export const titleTesting = () => {
    const titleObj = detailHelper.title();

    titleObj.getTitle().then((originalTitle) => {
        const date = Date.now();
        const newTitle = `New title ${date}`;

        titleObj.setTitle(newTitle);
        titleObj.save();

        cy.waitNotificationSuccess();

        titleObj.getTitle().should('not.equal', originalTitle);

        cy.waitNotificationSuccessClose();
    });
};

// ================================
// Tags Testing
// ================================

export const tagsTesting = () => {
    const tagsObj = detailHelper.tags();

    tagsObj.getTagsText().then((originalTags) => {
        tagsObj.clearTags();

        const date = Date.now();
        const newTags = ['1', '2', '3'].map((i) => `${date}-${i}`);

        tagsObj.addTags(newTags);

        tagsObj.getTagsText().should('not.equal', originalTags);
    });
};

// ================================
// Status Testing
// ================================

export const statusTesting = (status1: string, status2: string) => {
    const statusObj = detailHelper.statusSelector();

    // Status 1
    statusObj.setStatus(1).then((selectedStatus) => {
        expect(selectedStatus).to.contain(status1);
    });

    // Status 2
    statusObj.setStatus(2).then((newSelectedStatus) => {
        expect(newSelectedStatus).to.contain(status2);
    });
};

// ================================
// Assigned To Testing
// ================================

export const assignedToTesting = () => {
    describe('assigned to', () => {
        before(() => {
            const assignedTo = detailHelper.assignedTo();
            assignedTo.clear();
        });

        it('assign', () => {
            const assignedTo = detailHelper.assignedTo();
            const assignToLightbox = commonHelper.assignToLightbox();

            assignedTo.assign();
            assignToLightbox.waitOpen();
            assignToLightbox.selectFirst();
            assignToLightbox.waitClose();

            assignedTo.getUserName().should('not.be.empty');
        });

        it('unassign', () => {
            const assignedTo = detailHelper.assignedTo();
            assignedTo.clear();
            assignedTo.isUnassigned().should('exist');
        });

        it('filter', () => {
            const assignedTo = detailHelper.assignedTo();
            const assignToLightbox = commonHelper.assignToLightbox();

            assignedTo.assign();
            assignToLightbox.waitOpen();

            assignToLightbox.getNames().then((names) => {
                const nameArray = names.split('\n');
                if (nameArray.length > 1) {
                    assignToLightbox.filter(nameArray[1]);
                    assignToLightbox.userList().should('have.length.below', 3);
                }
            });

            assignToLightbox.selectFirst();
            assignToLightbox.waitClose();
        });

        it('keyboard navigation', () => {
            const assignedTo = detailHelper.assignedTo();
            const assignToLightbox = commonHelper.assignToLightbox();

            assignedTo.assign();
            assignToLightbox.waitOpen();

            cy.get('body')
                .type('{downarrow}')
                .type('{downarrow}')
                .type('{downarrow}')
                .type('{uparrow}');

            assignToLightbox.userList().eq(2).should('have.class', 'selected');

            assignToLightbox.close();
            assignToLightbox.waitClose();
        });
    });
};

// ================================
// History Testing
// ================================

export const historyTesting = (screenshotsFolder: string) => {
    const historyObj = detailHelper.history();

    historyObj.selectActivityTab();
    cy.takeNamedScreenshot(screenshotsFolder, 'show-activity-tab');
};

// ================================
// Block Testing
// ================================

export const blockTesting = () => {
    const blockObj = detailHelper.block();
    const blockLightboxObj = detailHelper.blockLightbox();

    blockObj.block();
    blockLightboxObj.waitOpen();
    blockLightboxObj.fill('This is a testing block reason');
    blockLightboxObj.submit();
    blockLightboxObj.waitClose();

    cy.get('.block-description').should('have.text', 'This is a testing block reason');
    cy.get('.block-desc-container').should('be.visible');

    blockObj.unblock();

    cy.get('.block-desc-container').should('not.be.visible');
    cy.waitNotificationSuccessClose();
};

// ================================
// Attachment Testing
// ================================

export const attachmentTesting = () => {
    const attachmentObj = detailHelper.attachment();
    const date = Date.now();

    // Upload attachment
    attachmentObj.countAttachments().then((attachmentsLength) => {
        cy.fixture('upload-file-test.txt', null).then((fileContent) => {
            attachmentObj.upload('cypress/fixtures/upload-file-test.txt', `Testing name ${date}`);
        });

        cy.wait(5000);

        // Check set name
        attachmentObj.getLastAttachmentName().should('contain', `Testing name ${date}`);

        // Check new length
        attachmentObj.countAttachments().should('equal', attachmentsLength + 1);
    });

    // Renaming
    attachmentObj.renameLastAttachment(`New testing name ${date}`);
    attachmentObj.getLastAttachmentName().should('contain', `New testing name ${date}`);

    // Deprecating
    attachmentObj.countDeprecatedAttachments().then((deprecatedCount) => {
        attachmentObj.deprecateLastAttachment();
        attachmentObj.countDeprecatedAttachments().then((newDeprecatedCount) => {
            expect(newDeprecatedCount).to.equal(deprecatedCount + 1);
        });
    });

    // Gallery
    attachmentObj.gallery();
    attachmentObj.galleryImages().should('have.length.above', 0);
    cy.takeNamedScreenshot('attachments', 'gallery');
    attachmentObj.list();

    // Deleting
    attachmentObj.countAttachments().then((attachmentsLength) => {
        attachmentObj.deleteLastAttachment();
        attachmentObj.countAttachments().should('equal', attachmentsLength - 1);
    });
};

// ================================
// Delete Testing
// ================================

export const deleteTesting = () => {
    const deleteObj = detailHelper.deleteItem();
    deleteObj.delete();
};

// ================================
// Watchers Testing
// ================================

export const watchersTesting = () => {
    describe('watchers', () => {
        before(() => {
            const watchersObj = detailHelper.watchers();
            watchersObj.removeAllWatchers();
        });

        it('add watcher', () => {
            const watchersObj = detailHelper.watchers();
            const watchersLightboxObj = detailHelper.watchersLightbox();

            watchersObj.addWatcher();
            watchersLightboxObj.waitOpen();
            watchersLightboxObj.selectFirst();
            watchersLightboxObj.waitClose();

            watchersObj.getWatchersUserNames().should('not.be.empty');
        });

        it('clear watcher', () => {
            const watchersObj = detailHelper.watchers();
            watchersObj.removeAllWatchers();
            watchersObj.getWatchersUserNames().should('be.empty');
        });

        it('filter watcher', () => {
            const watchersObj = detailHelper.watchers();
            const watchersLightboxObj = detailHelper.watchersLightbox();

            watchersObj.addWatcher();
            watchersLightboxObj.waitOpen();

            watchersLightboxObj.getNames().then((names) => {
                const nameArray = names.split('\n').filter(Boolean);
                if (nameArray.length > 0) {
                    watchersLightboxObj.filter(nameArray[0]);
                    watchersLightboxObj.userList().should('have.length', 1);
                }
            });

            watchersLightboxObj.selectFirst();
            watchersLightboxObj.waitClose();
        });
    });
};

// ================================
// Team Requirement Testing
// ================================

export const teamRequirementTesting = () => {
    it('team requirement edition', () => {
        const requirementObj = detailHelper.teamRequirement();

        requirementObj.isRequired().then((isRequired) => {
            requirementObj.toggleStatus();

            requirementObj.isRequired().should('not.equal', isRequired);

            // Toggle again
            requirementObj.toggleStatus();
            requirementObj.isRequired().should('equal', isRequired);
        });
    });
};

// ================================
// Client Requirement Testing
// ================================

export const clientRequirementTesting = () => {
    it('client requirement edition', () => {
        const requirementObj = detailHelper.clientRequirement();

        requirementObj.isRequired().then((isRequired) => {
            requirementObj.toggleStatus();

            requirementObj.isRequired().should('not.equal', isRequired);

            // Toggle again
            requirementObj.toggleStatus();
            requirementObj.isRequired().should('equal', isRequired);
        });
    });
};
