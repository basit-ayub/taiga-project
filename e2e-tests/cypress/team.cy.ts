/*
 * This source code is licensed under the terms of the
 * GNU Affero General Public License found in the LICENSE file in
 * the root directory of this source tree.
 *
 * Copyright (c) 2021-present Kaleidos INC
 */

/**
 * Team E2E Tests
 * Converted from: e2e/suites/team.e2e.js
 */

import * as teamHelper from '../support/pages/team.page';

describe('Team', () => {
    before(() => {
        cy.login('admin', '123123');
        cy.visit('/project/project-0/team');
        cy.waitLoader();
        cy.takeNamedScreenshot('team', 'team');
    });

    it('should display team members', () => {
        teamHelper.getMembers().should('have.length.above', 0);
    });

    it('should show member details on hover', () => {
        teamHelper.hoverMember(0);
        cy.get('.team-member').first().should('have.class', 'active');
    });

    it('should navigate to member profile on click', () => {
        teamHelper.getMemberName(0).then((memberName) => {
            teamHelper.clickMember(0);
            cy.url().should('include', '/profile/');
        });
    });

    describe('Stats', () => {
        before(() => {
            cy.visit('/project/project-0/team');
            cy.waitLoader();
        });

        it('should display open/closed stats', () => {
            teamHelper.getOpenClosedStat().should('not.be.empty');
        });
    });
});
