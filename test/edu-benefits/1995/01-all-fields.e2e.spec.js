const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
const Edu1995Helpers = require('../../e2e/edu-1995-helpers');
const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock('1995');

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1995`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for education benefits: Vets.gov')
      .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran information page.
    client
      .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
    EduHelpers.completeVeteranInformation(client, testData.veteranInformation.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran/information');

    // Benefits eligibility page.
    client
      .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
    EduHelpers.completeBenefitsSelection(client, testData.benefitSeletion, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

    // Service periods page.
    client
      .waitForElementVisible('label[for="root_view:newService"]', Timeouts.slow);
    EduHelpers.completeServicePeriods(client, testData.servicePeriods.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/service');

    // Military service page.
    client
      .waitForElementVisible('label[for="root_view:hasServiceBefore1978"]', Timeouts.slow);
    Edu1995Helpers.completeMilitaryService(client, testData.militaryHistory.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/service');

    // New school page.
    client
      .waitForElementVisible('label[for="root_educationType"]', Timeouts.slow);
    Edu1995Helpers.completeNewSchool(client, testData.newSchool.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/new-school');

    // Old school
    client
      .waitForElementVisible('label[for="root_oldSchool_name"]', Timeouts.slow);
    Edu1995Helpers.completeOldSchool(client, testData.oldSchool.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/old-school');

    // Contact information page.
    client
      .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
    EduHelpers.completeContactInformation(client, testData.contactInformation.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Dependents page.
    client
      .waitForElementVisible('label[for="root_serviceBefore1977_married"]', Timeouts.slow);
    Edu1995Helpers.completeDependents(client, testData.dependents.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/dependents');

    // Direct deposit page.
    client
      .waitForElementVisible('label[for="root_bankAccountChange"]', Timeouts.slow);
    EduHelpers.completePaymentChange(client, testData.directDeposit.data, false);
    EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, false);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

    // Review and submit page.
    client
      .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow);
    client
      .pause(1000)
      .click('input[type="checkbox"]')
      .click('.form-progress-buttons .usa-button-primary');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Confirmation page.
    client
      .expect.element('.edu-benefits-submit-success').to.be.visible;

    client.end();
  }
);
