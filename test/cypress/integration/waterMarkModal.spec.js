/**
 * For these tests to work
 * npm run start must be ran in the UI project
 */
describe ('Tests for watermark modal', () => {
  // it(() => {
  //   cy.server();
  //   cy.route({
  //     method: 'GET',
  //     url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
  //   }).as('getAccount');
  // });
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      status: 206,
    }).as('temp1');
    cy.route({
      method: 'GET',
      url: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      status: 200,
    }).as('temp2');
    cy.visit ('/');

    cy.wait(['@temp2']).then((xhr) => {
      // assert.isNotNull(xhr.response.body.data, '1st API call has data');
      cy.window({ timeout: 10000 }).should('have.property', 'appReady', true);
    });
    // cy.wait('@temp2').then((xhr) => {
    //   assert.isNotNull(xhr.response.body.data, '2nd API call has data')
    // });
    // cy.window().should('have.property', 'appReady', true);
  });

  it ('Should be able to open watermark modal from print modal', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");
  });

  it ('Should be able to close watermark modal by clicking on close icon', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");

    cy.get( '[data-element="watermarkModalCloseButton"]').click();

    cy.get( '[data-element="watermarkModal"]').should("not.visible");
  });

  it ('Should be able to close watermark modal by clicking outside of it', () => {
    cy.get('[data-element="menuButton"]').click();
    cy.get('[data-element="printButton"]').click();
    cy.get( '[data-element="printModal"]').should("visible");

    cy.get('.apply-watermark').click();

    cy.get( '[data-element="watermarkModal"]').should("visible");

    cy.get( '[data-element="watermarkModal"]').click('topLeft');

    cy.get( '[data-element="watermarkModal"]').should("not.visible");
  });
});