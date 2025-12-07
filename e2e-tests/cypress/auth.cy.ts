
describe('Auth', () => {
    before(() => {
        cy.visit('/');
        cy.closeCookies();
    });

    describe('Login', () => {
        beforeEach(() => {
            cy.clearAllCookies();
            cy.clearAllSessionStorage();
        });

        it('should login successfully', () => {
            cy.visit('/login');
            cy.waitLoader();

            cy.takeNamedScreenshot('auth', 'login');

            cy.get('input[name="username"]').type('admin');
            cy.get('input[name="password"]').type('admin');
            cy.contains('button', 'Login').click();

            cy.waitLoader();
            cy.url().should('not.include', '/login');
        });
    });

    describe('Page without permissions', () => {
        const path = 'project/project-4/';

        beforeEach(() => {
            cy.clearAllCookies();
            cy.clearAllSessionStorage();
        });

        it('should redirect to login', () => {
            cy.visit(`/${path}`);
            cy.waitLoader();

            cy.url().should('include', 'login');
            cy.url().should('include', 'unauthorized');
        });

        it('should redirect to previous page after login', () => {
            cy.visit(`/${path}`);
            cy.waitLoader();

            // Should be on login page
            cy.url().should('include', 'login');

            cy.get('input[name="username"]').type('admin');
            cy.get('input[name="password"]').type('admin');
            cy.contains('button', 'Login').click();

            cy.waitLoader();
            cy.url().should('include', path);
        });
    });

    describe('User', () => {
        let user = {
            username: '',
            fullname: '',
            password: '',
            email: '',
        };

        beforeEach(() => {
            cy.clearAllCookies();
            cy.clearAllSessionStorage();
        });
           

        it('should logout successfully', () => {
             cy.visit('/login');
            cy.waitLoader();
            cy.get('input[name="username"]').type('admin');
            cy.get('input[name="password"]').type('admin');
            cy.contains('button', 'Login').click();

           // Selects by both classes
            cy.get('.chevron').click();


            cy.contains('li','logout').click();

            cy.waitLoader();
            cy.url().should('include', 'discover');
        });
    });
});

    //     describe('Register', () => {
    //         it('should show register screen', () => {
    //             cy.visit('/register');
    //             cy.waitLoader();

    //             cy.takeNamedScreenshot('auth', 'register');
    //         });

    //         it('should show validation errors', () => {
    //             cy.visit('/register');
    //             cy.contains('button', 'Login').click();

    //             cy.takeNamedScreenshot('auth', 'register-validation');

    //             cy.get('.checksley-required').should('have.length', 4);
    //         });

    //         it('should register successfully', () => {
    //             cy.visit('/register');

    //             user.username = `username-${Math.random().toString(36).substring(7)}`;
    //             user.fullname = `fullname-${Math.random().toString(36).substring(7)}`;
    //             user.password = `password-${Math.random().toString(36).substring(7)}`;
    //             user.email = `email-${Math.random().toString(36).substring(7)}@taiga.io`;

    //             cy.get('input[name="username"]').type(user.username);
    //             cy.get('input[name="full_name"]').type(user.fullname);
    //             cy.get('input[name="email"]').type(user.email);
    //             cy.get('input[name="password"]').type(user.password);

    //            cy.contains('button', 'Login').click();

    //             cy.waitLoader();
    //             cy.url().should('eq', Cypress.config('baseUrl'));

    //             cy.visit('/');
    //             cy.waitLoader();
    //             cy.closeJoyride();
    //         });
    //     });

    //     describe('Change Password', () => {
    //         it('should show error with wrong password', () => {
    //             cy.loginFresh(user.username, user.password);
    //             cy.visit('/user-settings/user-change-password');

    //             cy.get('#current-password').type('wrongpassword');
    //             cy.get('#new-password').type('123123');
    //             cy.get('#retype-password').type('123123');

    //             cy.contains('button', 'Login').click();

    //             cy.waitNotificationError();
    //         });

    //         it('should change password successfully', () => {
    //             cy.loginFresh(user.username, user.password);
    //             cy.visit('/user-settings/user-change-password');

    //             cy.get('#current-password').type(user.password);
    //             cy.get('#new-password').type(user.password);
    //             cy.get('#retype-password').type(user.password);

    //             cy.contains('button', 'Login').click();

    //             cy.waitNotificationSuccess();
    //             cy.waitNotificationSuccessClose();
    //         });
    //     });

    //     describe('Remember Password', () => {
    //         beforeEach(() => {
    //             cy.clearAllCookies();
    //             cy.clearAllSessionStorage();
    //             cy.visit('/forgot-password');
    //         });

    //         it('should show remember password screen', () => {
    //             cy.waitLoader();
    //             cy.takeNamedScreenshot('auth', 'remember-password');
    //         });

    //         it('should show error for unknown user', () => {
    //             cy.get('input[name="username"]').type('xxxxxxxx');
    //             cy.contains('button', 'Login').click();

    //             cy.waitNotificationErrorLight();
    //         });

    //         it('should send recovery email successfully', () => {
    //             cy.get('input[name="username"]').type(user.username);
    //             cy.contains('button', 'Login').click();

    //             cy.waitLightboxOpen('.lightbox-generic-success');
    //             cy.takeNamedScreenshot('auth', 'remember-password-success');

    //             cy.get('.lightbox-generic-success .button-green').click();
    //             cy.waitLightboxClose('.lightbox-generic-success');
    //         });
    //     });

    //     describe('Delete Account', () => {
    //         it('should delete account', () => {
    //             cy.loginFresh(user.username, user.password);
    //             cy.visit('/user-settings/user-profile');

    //             cy.get('.delete-account').click();

    //             cy.waitLightboxOpen('.lightbox-delete-account');
    //             cy.takeNamedScreenshot('auth', 'delete-account');

    //             cy.get('.lightbox-delete-account .button-red').click();

    //             cy.url().should('include', 'login');
    //         });
    //     });
    // });
    
