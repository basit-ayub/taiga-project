describe("Sprint Creation Tests", () => {

  const loginUrl = "/login";
  const backlogUrl = "/project/public-project/backlog";

  const username = "admin";
  const password = "admin";

  beforeEach(() => {
    // LOGIN
    cy.visit(loginUrl);
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/login");

    // OPEN BACKLOG PAGE
    cy.visit(backlogUrl);
    cy.contains("Backlog").should("exist");

    // OPEN SPRINT CREATION MODAL
    cy.contains("a", "Add a sprint").click();

    // WAIT FOR THE LIGHTBOX
    cy.get('form[ng-if="createEditOpen"]', { timeout: 10000 })
      .should("be.visible")
      .and("contain", "New sprint");
  });

  // -----------------------------
  // TC-01 — Sprint name REQUIRED
  // -----------------------------
  it("TC-01: Sprint name is required", () => {
    cy.get('input[name="name"]').clear();

    cy.get('form[ng-if="createEditOpen"] button[type="submit"]')
      .click({ force: true });

    cy.contains("This value is required").should("be.visible");
  });

  // --------------------------------------
  // TC-02 — Wrong start date format
  // --------------------------------------
  it("TC-02: Wrong start date format shows error", () => {
    cy.get('input[name="name"]').type("Sprint X");

    cy.get('input[name="estimated_start"]').clear().type("WrongDate");

    cy.get('form[ng-if="createEditOpen"] button[type="submit"]')
      .click({ force: true });

    cy.contains(
      "Date has wrong format. Use one of these formats instead: YYYY[-MM[-DD]]"
    ).should("be.visible");
  });

  // --------------------------------------
  // TC-03 — Wrong end date format
  // --------------------------------------
  it("TC-03: Wrong end date format shows error", () => {
    cy.get('input[name="name"]').type("Sprint Y");

    cy.get('input[name="estimated_finish"]').clear().type("NONSENSE");

    cy.get('form[ng-if="createEditOpen"] button[type="submit"]')
      .click({ force: true });

    cy.contains(
      "Date has wrong format. Use one of these formats instead: YYYY[-MM[-DD]]"
    ).should("be.visible");
  });

  // ------------------------------------------------------------
  // TC-04 — Start date > End date (invalid chronological order)
  // ------------------------------------------------------------
  it("TC-04: Start date must be before end date", () => {
    cy.get('input[name="name"]').type("Sprint Z");

    cy.get('input[name="estimated_start"]').clear().type("2027-01-10");
    cy.get('input[name="estimated_finish"]').type("2026-01-05");
    
    cy.get('form[ng-if="createEditOpen"] button[type="submit"]')
      .click({ force: true });

    cy.contains(
      "The estimated start must be previous to the estimated finish."
    ).should("be.visible");
  });

  // -----------------------------
  // TC-05 — Successful sprint create
  // -----------------------------
it("TC-5: Create a new sprint successfully", () => {
  cy.contains("span", "Add a sprint")
    .should("be.visible")
    .click({ force: true });

  cy.get('form[ng-if="createEditOpen"]', { timeout: 10000 })
    .should("be.visible");

  cy.get('input[name="name"]').clear().type("Automation Sprint");

  // Start date
  cy.get('input[name="estimated_start"]')
    .clear()
    .type("22 Dec 2025");

  // End date
  cy.get('input[name="estimated_finish"]')
    .clear()
    .type("05 Jan 2026");

  // 🔥 FIX — Taiga clears start date automatically
  cy.get('input[name="estimated_start"]')
    .clear()
    .type("22 Dec 2025");

  cy.get('form[ng-if="createEditOpen"] button[type="submit"]')
    .click({ force: true });

});


});
