import TicketService,{TICKET_TYPE} from './pairtest/TicketService.js'
import TicketTypeRequest from './pairtest/lib/TicketTypeRequest.js'




const accountID = 7
const foo = new TicketTypeRequest(TICKET_TYPE.ADULT,5);
const bar = new TicketTypeRequest(TICKET_TYPE.CHILD,1)
const foobar = new TicketTypeRequest(TICKET_TYPE.INFANT,10)



const ticketService =  new TicketService()

ticketService.purchaseTickets(accountID, foo,bar, foobar)

