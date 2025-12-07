/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/// <reference types="cypress" />

// ================================
// Authentication Commands
// ================================

/**
 * Login to the application
 * Replaces: utils.common.login()
 */
Cypress.Commands.add('login', (username: string, password: string) => {
    cy.session([username, password], () => {
        cy.visit('/login');
        cy.waitLoader();
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('.submit-button').click();
        cy.url().should('eq', Cypress.config('baseUrl'));
        cy.closeJoyride();
    });
});

/**
 * Login without session caching (for tests that need fresh login)
 */
Cypress.Commands.add('loginFresh', (username: string, password: string) => {
    cy.visit('/login');
    cy.waitLoader();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('.submit-button').click();
    cy.url().should('eq', Cypress.config('baseUrl'));
    cy.closeJoyride();
});

/**
 * Logout from the application
 * Replaces: utils.common.logout()
 */
Cypress.Commands.add('logout', () => {
    cy.get('div[tg-dropdown-user]').trigger('mouseenter');
    cy.get('.navbar-dropdown li a').last().click();
    cy.url().should('include', 'discover');
});

// ================================
// Wait Commands
// ================================

/**
 * Wait for loader to disappear
 * Replaces: utils.common.waitLoader()
 */
Cypress.Commands.add('waitLoader', () => {
    cy.get('.loader', { timeout: 10000 }).should('not.have.class', 'active');
});

/**
 * Close cookie consent banner
 * Replaces: utils.common.closeCookies()
 */
Cypress.Commands.add('closeCookies', () => {
    cy.window().then((win) => {
        win.document.cookie = 'cookieConsent=1';
    });
});

/**
 * Close joyride/intro tutorial
 * Replaces: utils.common.closeJoyride()
 */
Cypress.Commands.add('closeJoyride', () => {
    cy.get('body').then(($body) => {
        if ($body.find('.introjs-skipbutton').length > 0) {
            cy.get('.introjs-skipbutton').click();
            cy.wait(600);
        }
    });
});

/**
 * Wait for transition to complete
 * Replaces: utils.common.waitTransitionTime()
 */
Cypress.Commands.add('waitTransition', { prevSubject: 'element' }, (subject) => {
    cy.wrap(subject).then(($el) => {
        const transition = $el.css('transition-duration') || '0s';
        const delay = $el.css('transition-delay') || '0s';
        const time = parseFloat(transition.replace('s', '')) * 1000;
        const timeDelay = parseFloat(delay.replace('s', '')) * 1000;
        cy.wait(time + timeDelay);
    });
    return cy.wrap(subject);
});

// ================================
// Lightbox Commands
// ================================

/**
 * Wait for lightbox to open
 * Replaces: utils.lightbox.open()
 */
Cypress.Commands.add('waitLightboxOpen', (selector: string) => {
    cy.get(selector, { timeout: 5000 }).should('have.class', 'open');
    cy.wait(400); // transition time
});

/**
 * Wait for lightbox to close
 * Replaces: utils.lightbox.close()
 */
Cypress.Commands.add('waitLightboxClose', (selector: string) => {
    cy.get(selector, { timeout: 5000 }).should('not.have.class', 'open');
});

/**
 * Exit/close a lightbox
 * Replaces: utils.lightbox.exit()
 */
Cypress.Commands.add('exitLightbox', (selector?: string) => {
    const lightboxSelector = selector || '.lightbox.open';
    cy.get(lightboxSelector).find('.close').click();
    cy.waitLightboxClose(lightboxSelector);
});

/**
 * Confirm dialog - click OK
 * Replaces: utils.lightbox.confirm.ok()
 */
Cypress.Commands.add('confirmOk', () => {
    cy.waitLightboxOpen('.lightbox-generic-ask');
    cy.get('.lightbox-generic-ask .button-green').click();
    cy.waitLightboxClose('.lightbox-generic-ask');
});

/**
 * Confirm dialog - click Cancel
 * Replaces: utils.lightbox.confirm.cancel()
 */
Cypress.Commands.add('confirmCancel', () => {
    cy.waitLightboxOpen('.lightbox-generic-ask');
    cy.get('.lightbox-generic-ask .button-red').click();
    cy.waitLightboxClose('.lightbox-generic-ask');
});

// ================================
// Notification Commands
// ================================

/**
 * Wait for success notification
 * Replaces: utils.notifications.success.open()
 */
Cypress.Commands.add('waitNotificationSuccess', () => {
    cy.get('.notification-message-success', { timeout: 6000 })
        .should('have.class', 'active');
    cy.wait(600); // transition time
});

/**
 * Wait for success notification to close
 * Replaces: utils.notifications.success.close()
 */
Cypress.Commands.add('waitNotificationSuccessClose', () => {
    cy.get('.notification-message-success', { timeout: 6000 })
        .should('have.class', 'inactive');
    cy.wait(600);
});

/**
 * Wait for error notification
 * Replaces: utils.notifications.error.open()
 */
Cypress.Commands.add('waitNotificationError', () => {
    cy.get('.notification-message-error', { timeout: 6000 })
        .should('have.class', 'active');
    cy.wait(600);
});

/**
 * Wait for light error notification
 * Replaces: utils.notifications.errorLight.open()
 */
Cypress.Commands.add('waitNotificationErrorLight', () => {
    cy.get('.notification-message-light-error', { timeout: 6000 })
        .should('have.class', 'active');
    cy.wait(600);
});

// ================================
// Popover Commands
// ================================

/**
 * Open popover and optionally select items
 * Replaces: utils.popover.open()
 */
Cypress.Commands.add('openPopover', { prevSubject: 'element' }, (subject, item?: number, item2?: number) => {
    cy.wrap(subject).click();
    cy.get('.popover.active', { timeout: 3000 }).should('exist');

    if (item !== undefined) {
        cy.get('.popover.active a').eq(item).click();
        cy.wait(400);

        if (item2 !== undefined) {
            cy.get('.popover.active', { timeout: 3000 }).should('exist');
            cy.get('.popover.active a').eq(item2).click();
            cy.wait(400);
        }
    }

    return cy.get('.popover.active');
});

// ================================
// Drag & Drop Commands
// ================================

/**
 * Drag element to another element
 * Replaces: utils.common.drag()
 */
Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, targetSelector: string, offsetX = 0, offsetY = 0) => {
    const dataTransfer = new DataTransfer();

    cy.wrap(subject)
        .scrollIntoView()
        .trigger('mousedown', { which: 1 });

    cy.get(targetSelector)
        .scrollIntoView()
        .trigger('mousemove', { clientX: offsetX, clientY: offsetY })
        .trigger('mouseup', { force: true });

    // Wait for drag to complete
    cy.get('.gu-mirror').should('not.exist');
});

/**
 * Alternative drag using dataTransfer (for HTML5 drag)
 */
Cypress.Commands.add('dragAndDrop', { prevSubject: 'element' }, (subject, targetSelector: string) => {
    const dataTransfer = new DataTransfer();

    cy.wrap(subject).trigger('dragstart', { dataTransfer });
    cy.get(targetSelector).trigger('drop', { dataTransfer });
    cy.wrap(subject).trigger('dragend');
});

// ================================
// File Upload Commands
// ================================

/**
 * Upload a file
 * Replaces: utils.common.uploadFile()
 */
Cypress.Commands.add('uploadFile', { prevSubject: 'element' }, (subject, filePath: string) => {
    cy.wrap(subject).then(($input) => {
        // Make input visible if hidden
        if ($input.is(':hidden')) {
            cy.wrap($input).invoke('show').invoke('removeClass', 'hidden');
        }
    });

    cy.wrap(subject).selectFile(filePath, { force: true });
});

// ================================
// Navigation Commands
// ================================

/**
 * Navigate to a project
 * Replaces: utils.nav.project()
 */
Cypress.Commands.add('goToProject', (projectIndexOrName: number | string) => {
    cy.get('div[tg-dropdown-project-list]').trigger('mouseenter');

    if (typeof projectIndexOrName === 'string') {
        cy.get('div[tg-dropdown-project-list]')
            .contains('li a', projectIndexOrName)
            .click();
    } else {
        cy.get('div[tg-dropdown-project-list] li a')
            .eq(projectIndexOrName)
            .click();
    }

    cy.waitLoader();
});

/**
 * Navigate to issues
 */
Cypress.Commands.add('goToIssues', () => {
    cy.get('#nav-issues a').click();
    cy.waitLoader();
});

/**
 * Navigate to backlog
 */
Cypress.Commands.add('goToBacklog', () => {
    cy.get('#nav-backlog a').first().click();
    cy.waitLoader();
});

/**
 * Navigate to epics
 */
Cypress.Commands.add('goToEpics', () => {
    cy.get('#nav-epics a').click();
    cy.waitLoader();
});

/**
 * Navigate to admin
 */
Cypress.Commands.add('goToAdmin', () => {
    cy.get('#nav-admin a').click();
    cy.waitLoader();
});

/**
 * Navigate to team
 */
Cypress.Commands.add('goToTeam', () => {
    cy.get('#nav-team a').click();
    cy.waitLoader();
});

/**
 * Navigate to first sprint taskboard
 */
Cypress.Commands.add('goToTaskboard', (index = 0) => {
    cy.get('.sprints .button-gray').eq(index).click();
    cy.waitLoader();
});

// ================================
// Utility Commands
// ================================

/**
 * Clear input field thoroughly
 * Replaces: utils.common.clear()
 */
Cypress.Commands.add('clearInput', { prevSubject: 'element' }, (subject) => {
    cy.wrap(subject).clear();
    return cy.wrap(subject);
});

/**
 * Take a screenshot with section/filename
 * Replaces: utils.common.takeScreenshot()
 */
Cypress.Commands.add('takeNamedScreenshot', (section: string, filename: string) => {
    cy.screenshot(`${section}/${filename}`);
});

/**
 * Get project URL root
 * Replaces: utils.common.getProjectUrlRoot()
 */
Cypress.Commands.add('getProjectUrlRoot', () => {
    return cy.url().then((url) => {
        const parts = url.split('/');
        return `${Cypress.config('baseUrl')}${parts.slice(3, 5).join('/')}`;
    });
});

/**
 * Create a new project
 * Replaces: utils.common.createProject()
 */
Cypress.Commands.add('createProject', (members: string[] = []) => {
    cy.visit('/project/new');
    cy.waitLoader();

    // Select Scrum option
    cy.get('.scrum-option, [data-project-type="scrum"]').click();

    const projectName = `name ${Date.now()}`;
    const projectDescription = `description ${Date.now()}`;

    cy.get('input[name="name"]').type(projectName);
    cy.get('textarea[name="description"]').type(projectDescription);
    cy.get('button[type="submit"]').click();

    cy.waitLoader();

    cy.url().then((url) => {
        const projectSlug = url.split('/')[4];

        if (members.length > 0) {
            cy.visit(`/project/${projectSlug}/admin/memberships`);
            cy.waitLoader();

            // Add members
            cy.get('.add-member-button').click();
            cy.waitLightboxOpen('div[tg-lb-add-members]');

            members.forEach((member) => {
                cy.get('.new-member-email').type(member);
                cy.get('.role-selector').first().click();
            });

            cy.get('button[type="submit"]').click();
            cy.waitLightboxClose('div[tg-lb-add-members]');
        }

        return cy.wrap(projectSlug);
    });
});

// ================================
// Type Declarations
// ================================

declare global {
    namespace Cypress {
        interface Chainable {
            // Authentication
            login(username: string, password: string): Chainable<void>;
            loginFresh(username: string, password: string): Chainable<void>;
            logout(): Chainable<void>;

            // Wait commands
            waitLoader(): Chainable<void>;
            closeCookies(): Chainable<void>;
            closeJoyride(): Chainable<void>;
            waitTransition(): Chainable<JQuery<HTMLElement>>;

            // Lightbox
            waitLightboxOpen(selector: string): Chainable<void>;
            waitLightboxClose(selector: string): Chainable<void>;
            exitLightbox(selector?: string): Chainable<void>;
            confirmOk(): Chainable<void>;
            confirmCancel(): Chainable<void>;

            // Notifications
            waitNotificationSuccess(): Chainable<void>;
            waitNotificationSuccessClose(): Chainable<void>;
            waitNotificationError(): Chainable<void>;
            waitNotificationErrorLight(): Chainable<void>;

            // Popover
            openPopover(item?: number, item2?: number): Chainable<JQuery<HTMLElement>>;

            // Drag & Drop
            dragTo(targetSelector: string, offsetX?: number, offsetY?: number): Chainable<void>;
            dragAndDrop(targetSelector: string): Chainable<void>;

            // File Upload
            uploadFile(filePath: string): Chainable<void>;

            // Navigation
            goToProject(projectIndexOrName: number | string): Chainable<void>;
            goToIssues(): Chainable<void>;
            goToBacklog(): Chainable<void>;
            goToEpics(): Chainable<void>;
            goToAdmin(): Chainable<void>;
            goToTeam(): Chainable<void>;
            goToTaskboard(index?: number): Chainable<void>;

            // Utility
            clearInput(): Chainable<JQuery<HTMLElement>>;
            takeNamedScreenshot(section: string, filename: string): Chainable<void>;
            getProjectUrlRoot(): Chainable<string>;
            createProject(members?: string[]): Chainable<string>;
        }
    }
}

export { };
