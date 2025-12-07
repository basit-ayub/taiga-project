/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

// Import custom commands
import './commands';

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
        '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

// Prevent Cypress from failing on uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
    // Return false to prevent Cypress from failing the test
    // This matches Protractor behavior which doesn't fail on JS errors
    console.warn('Uncaught exception:', err.message);
    return false;
});

// Add custom assertion for class checking
chai.Assertion.addMethod('haveClass', function (className: string) {
    const $el = this._obj;
    this.assert(
        $el.hasClass(className),
        `expected #{this} to have class '${className}'`,
        `expected #{this} not to have class '${className}'`,
        className
    );
});
