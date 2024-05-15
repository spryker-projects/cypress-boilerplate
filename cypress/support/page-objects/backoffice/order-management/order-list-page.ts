import { AbstractPage } from '../../abstract-page'

export class OrderListPage extends AbstractPage {
  protected PAGE_URL = Cypress.env('BACK_OFFICE_URL') + '/sales'

  getOrderInTable = (orderPosition: number): Cypress.Chainable => {
    return cy
      .get('.dataTables_scrollBody')
      .find('tbody')
      .find('tr')
      .eq(orderPosition)
  }

  getOrderReference = (orderPosition: number): Cypress.Chainable => {
    return this.getOrderInTable(orderPosition).find('td').eq(1)
  }

  getOrderViewButton = (orderPosition: number): Cypress.Chainable => {
    return this.getOrderInTable(orderPosition).contains('View')
  }

  viewOrder = (orderPosition: number): void => {
    this.getOrderViewButton(orderPosition).click()
  }
}
