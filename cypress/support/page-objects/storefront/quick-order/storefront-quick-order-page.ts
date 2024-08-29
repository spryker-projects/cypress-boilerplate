import { AbstractPage } from '../../abstract-page'

export class StorefrontQuickOrderPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('STOREFRONT_URL') + '/en/quick-order'

  getQuickOrderForm = (): Cypress.Chainable => {
    return cy.get('[data-qa="component quick-order-form"]')
  }

  getQuickOrderRows = (): Cypress.Chainable => {
    return this.getQuickOrderForm()
      .find('[data-qa="component quick-order-row"]')
  }

  getProductSearchAutocompleteFields = (): Cypress.Chainable => {
    return cy.get('[data-qa="component product-search-autocomplete-form"]')
  }

  searchProduct = (
    fieldIndex: number,
    skuOrName: string
  ): Cypress.Chainable => {
    return this.getProductSearchAutocompleteFields()
      .eq(fieldIndex)
      .type(skuOrName)
  }

  applySuggestedProduct = (skuOrName: string): Cypress.Chainable => {
    return cy
      .get('[data-qa="component products-list"]')
      .contains(skuOrName)
      .click()
  }

  selectProductMerchant = (
    fieldIndex: number,
    merchant: string
  ): Cypress.Chainable => {
    return this.getQuickOrderRows()
      .eq(fieldIndex)
      .find('[data-qa="component custom-select"] select')
      .should('contain', merchant)
      .select(merchant, { force: true })
  }

  incrementQuantity = (rowIndex: number): Cypress.Chainable => {
    return this.getQuickOrderRows()
      .eq(rowIndex)
      .find('.quick-order-row-partial__button--increment')
      .click()
  }

  decrementQuantity = (rowIndex: number): Cypress.Chainable => {
    return this.getQuickOrderRows()
      .eq(rowIndex)
      .find('.quick-order-row-partial__button--decrement')
      .click()
  }

  removeProduct = (rowIndex: number): Cypress.Chainable => {
    return cy
      .get('.js-quick-order-form__remove-row-trigger')
      .eq(rowIndex)
      .click()
  }

  selectMerchant = (merchant: string): void => {
    this.getQuickOrderForm()
      .find('[data-qa="component custom-select"] select')
      .first()
      .select(merchant, { force: true })
  }

  addToCart = (): Cypress.Chainable => {
    return cy.get('[name="addToCart"]')
      .click()
  }

  createOrder = (): Cypress.Chainable => {
    return cy.get('[name="createOrder"]')
      .click()
  }
}