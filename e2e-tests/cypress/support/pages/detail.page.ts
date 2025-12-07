/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Detail Page Object - Common detail functionality
 * Converted from: e2e/helpers/detail-helper.js
 */

// ================================
// Title Section
// ================================

export const title = () => {
    const el = '.e2e-story-header';

    return {
        el,
        getTitle: () => cy.get(`${el} .e2e-title-subject`).invoke('text'),
        setTitle: (titleText: string) => {
            cy.get(`${el} .e2e-detail-edit`).click();
            cy.get(`${el} .e2e-title-input`).clear().type(titleText);
        },
        save: () => cy.get(`${el} .e2e-title-button`).click(),
    };
};

// ================================
// Description Section
// ================================

export const description = () => {
    const el = 'section[tg-editable-description]';

    return {
        el,
        focus: () => cy.get(`${el} textarea`).click(),
        enableEditionMode: () => cy.get(`${el} .view-description`).click(),
        getInnerHtml: () => cy.get(`${el} .wysiwyg.editable`).invoke('html'),
        setText: (text: string) => cy.get(`${el} textarea`).clear().type(text),
        save: () => cy.get(`${el} .save`).click(),
    };
};

// ================================
// Tags Section
// ================================

export const tags = () => {
    const el = 'tg-tag-line-common';

    return {
        el,
        clearTags: () => {
            cy.get(`${el} .e2e-delete-tag`).then(($tags) => {
                const count = $tags.length;
                for (let i = 0; i < count; i++) {
                    cy.get(`${el} .e2e-delete-tag`).first().click();
                    cy.wait(300);
                }
            });
        },
        getTagsText: () => cy.get(`${el} tg-tag span`).invoke('text'),
        addTags: (tagList: string[]) => {
            cy.get('.e2e-show-tag-input').click();
            tagList.forEach((tag) => {
                cy.get(`${el} .e2e-add-tag-input`).type(tag);
                cy.get(`${el} .save`).click();
                cy.wait(300);
            });
        },
    };
};

// ================================
// Status Selector
// ================================

export const statusSelector = () => {
    const el = '.ticket-data';

    return {
        el,
        setStatus: (value: number) => {
            cy.get(`${el} .detail-status-inner`).openPopover(value);
            return cy.get(`${el} .detail-status-inner .e2e-status`).first().invoke('html');
        },
        getSelectedStatus: () => cy.get(`${el} .detail-status-inner .e2e-status`).first().invoke('html'),
    };
};

// ================================
// Assigned To Section
// ================================

export const assignedTo = () => {
    const el = '.menu-secondary .assigned-to';

    return {
        el,
        clear: () => {
            cy.get(`${el} .icon-delete`).then(($deleteBtn) => {
                if ($deleteBtn.length > 0) {
                    cy.wrap($deleteBtn).click();
                    cy.confirmOk();
                }
            });
        },
        assign: () => cy.get(`${el} .user-assigned`).click(),
        getUserName: () => cy.get(`${el} .user-assigned`).invoke('text'),
        isUnassigned: () => cy.get(`${el} .assign-to-me`),
    };
};

// ================================
// History Section
// ================================

export const history = () => {
    const el = 'section.history';

    return {
        el,
        selectCommentsTab: () => cy.get(`${el} .e2e-comments-tab`).click(),
        selectActivityTab: () => cy.get(`${el} .e2e-activity-tab`).click(),
        countComments: () => cy.get(`${el} .comment-wrapper`).its('length'),
        countActivities: () => cy.get(`${el} .activity`).its('length'),
        countDeletedComments: () => cy.get(`${el} .deleted-comment-wrapper`).its('length'),
        getComments: () => cy.get('tg-comment'),
        editLastComment: () => {
            cy.get(`${el} .comment-wrapper`).last().trigger('mouseenter');
            cy.get(`${el} .comment-wrapper`).last().find('.comment-option').first().click();
        },
        deleteLastComment: () => {
            cy.get(`${el} .comment-wrapper`).last().trigger('mouseenter');
            cy.get(`${el} .comment-wrapper`).last().find('.comment-option').last().click();
        },
        showVersionsLastComment: () => cy.get(`${el} .comment-edited a`).last().click(),
        closeVersionsLastComment: () => cy.get('.lightbox-display-historic .close').click(),
        restoreLastComment: () => cy.get(`${el} .deleted-comment-wrapper .restore-comment`).last().click(),
    };
};

// ================================
// Block Section
// ================================

export const block = () => {
    const el = 'tg-block-button';

    return {
        el,
        block: () => cy.get(`${el} .item-block`).click(),
        unblock: () => cy.get(`${el} .item-unblock`).click(),
    };
};

export const blockLightbox = () => {
    const el = 'div[tg-lb-block]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitNotificationSuccessClose(),
        fill: (text: string) => cy.get(`${el} textarea`).type(text),
        submit: () => cy.get(`${el} a.button-green`).click(),
    };
};

// ================================
// Delete Section
// ================================

export const deleteItem = () => {
    const el = 'tg-delete-button';

    return {
        el,
        delete: () => {
            cy.get(`${el} .button-red`).click();
            cy.confirmOk();
        },
    };
};

// ================================
// Attachments Section
// ================================

export const attachment = () => {
    const el = 'tg-attachments-full';

    return {
        el,
        waitEditableClose: () => {
            cy.get('tg-attachment .editable-attachment-comment', { timeout: 5000 }).should('not.exist');
        },
        upload: (filePath: string, name: string) => {
            cy.get(`${el} #add-attach`).then(($input) => {
                cy.wrap($input).invoke('show').invoke('removeClass', 'hidden');
                cy.wrap($input).selectFile(filePath, { force: true });
            });
            cy.get('tg-attachment .editable-attachment-comment input', { timeout: 5000 }).should('exist');
            cy.get('tg-attachment .editable-attachment-comment input').type(`${name}{enter}`);
            cy.wait(500);
        },
        renameLastAttachment: (name: string) => {
            cy.get(`${el} tg-attachment`).last().trigger('mouseenter');
            cy.get(`${el} tg-attachment`).last().find('.attachment-settings .settings').first().click();
            cy.get('tg-attachment .editable-attachment-comment input', { timeout: 5000 }).should('exist');
            cy.get(`${el} tg-attachment .editable-attachment-comment input`).last().type(`${name}{enter}`);
        },
        getFirstAttachmentName: () => cy.get(`${el} tg-attachment .attachment-comments`).first().invoke('text'),
        getLastAttachmentName: () => cy.get(`${el} tg-attachment .attachment-comments`).last().invoke('text'),
        countAttachments: () => cy.get(`${el} tg-attachment`).its('length'),
        countDeprecatedAttachments: () => {
            return cy.get('body').then(($body) => {
                if ($body.find(`${el} .more-attachments .more-attachments-num`).length > 0) {
                    return cy.get(`${el} .more-attachments .more-attachments-num`)
                        .invoke('attr', 'translate-values')
                        .then((val) => parseInt(val || '0'));
                }
                return cy.wrap(0);
            });
        },
        deprecateLastAttachment: () => {
            cy.get(`${el} tg-attachment`).last().trigger('mouseenter');
            cy.get(`${el} tg-attachment`).last().find('.attachment-settings .e2e-edit').click();
            cy.get(`${el} tg-attachment .editable-attachment-deprecated input`).last().click();
            cy.get(`${el} tg-attachment .attachment-settings`).last().find('.e2e-save').click();
        },
        showDeprecated: () => cy.get(`${el} .more-attachments-num`).click(),
        deleteLastAttachment: () => {
            cy.get('tg-attachment').last().trigger('mouseenter');
            cy.get('tg-attachment').last().find('.attachment-settings a').eq(1).click();
            cy.confirmOk();
        },
        gallery: () => cy.get('.view-gallery').click(),
        list: () => cy.get('.view-list').click(),
        galleryImages: () => cy.get('tg-attachment-gallery'),
        previewLightbox: () => cy.waitLightboxOpen('tg-attachments-preview'),
        getPreviewSrc: () => cy.get('tg-attachments-preview img').invoke('attr', 'src'),
        nextPreview: () => cy.get('tg-attachments-preview .next').click(),
        attachmentLinks: () => cy.get('.e2e-attachment-link'),
    };
};

// ================================
// Watchers Section
// ================================

export const watchers = () => {
    const el = '.ticket-watch-buttons';

    return {
        el,
        addWatcher: () => cy.get(`${el} .add-watcher`).click(),
        getWatchersUserNames: () => cy.get(`${el} .user-list-name span`).invoke('text'),
        removeAllWatchers: () => {
            cy.get(`${el} .js-delete-watcher`).then(($watchers) => {
                const count = $watchers.length;
                for (let i = 0; i < count; i++) {
                    cy.get(`${el} .js-delete-watcher`).first().click();
                    cy.confirmOk();
                }
            });
        },
    };
};

export const watchersLightbox = () => {
    const el = 'div[tg-lb-watchers]';

    return {
        el,
        waitOpen: () => cy.waitLightboxOpen(el),
        waitClose: () => cy.waitLightboxClose(el),
        close: () => cy.get(`${el} .close`).first().click(),
        selectFirst: () => cy.get(`${el} div[data-user-id]`).first().click(),
        getFirstName: () => cy.get(`${el} .lightbox .ticket-watchers div[data-user-id]`).first().invoke('text'),
        getNames: () => cy.get(`${el} .user-list-name`).invoke('text'),
        filter: (text: string) => cy.get(`${el} input`).type(text),
        userList: () => cy.get(`${el} .user-list-single`),
    };
};

// ================================
// Requirements Section
// ================================

export const teamRequirement = () => {
    const el = 'tg-us-team-requirement-button';

    return {
        el,
        toggleStatus: () => cy.get(`${el} label`).click(),
        isRequired: () => cy.get(`${el} label`).invoke('hasClass', 'active'),
    };
};

export const clientRequirement = () => {
    const el = 'tg-us-client-requirement-button';

    return {
        el,
        toggleStatus: () => cy.get(`${el} label`).click(),
        isRequired: () => cy.get(`${el} label`).invoke('hasClass', 'active'),
    };
};
