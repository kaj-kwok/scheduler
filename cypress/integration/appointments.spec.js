describe("Appointments", () => {

  beforeEach(() => {
  cy.request("GET", "http://localhost:8001/api/debug/reset")
  cy.visit("/")
      .contains("Monday")
  });

  it("should book an interview", () => {
    cy.get('[alt=Add]')
      .first()
      .click()
      .get("[data-testid=student-name-input]").type("Lydia Miller-Jones")
      .get("[alt='Sylvia Palmer']").click()

    cy.contains("Save").click()

    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
    cy.contains(".appointment__card--show", "Sylvia Palmer")
      
  });

  it("should edit an interview", () => {
    cy.get("[alt=Edit]")
      .first()
      .click({force:true})
    cy.get("[alt='Tori Malcolm']").click()
      .get("[data-testid=student-name-input]").clear().type("Ryan K")
    cy.contains("Save").click()

    cy.contains(".appointment__card--show", "Ryan K")
    cy.contains(".appointment__card--show", "Tori Malcolm")
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .first()
      .click({force:true})
    cy.contains("Confirm").click()
    cy.contains("Deleting")
      .should("be.visible")
    cy.contains("Deleting")
      .should("not.exist")

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  })
});