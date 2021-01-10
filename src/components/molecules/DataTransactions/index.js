import PaymentDropDown from '../../atoms/paymentDropDown';
import {Port} from '../../../config/api'

const DataTransactions = ({transaction, handlePayment, number}) => {
    const {id, proofTransaction, remainingActive, paymentStatus} = transaction;
    let numbering = number + 1;
    return (
        <>
        <tr>
            <td className="align-middle">{numbering}</td>
            <td className="align-middle text-center">{transaction.user.fullName}</td>
            <td className="text-center">
                <img 
                    src={`${Port}/${proofTransaction}`}
                    alt={proofTransaction}
                    className="img-fluid"
                    style={{
                        height:"75px",
                        objectFit: "cover",
                    }}
                />
            </td>
            <td className="align-middle text-center">{remainingActive} / Days</td>
            <td className="align-middle text-center">{transaction.user.status}</td>
            <td className={`${paymentStatus} align-middle text-center`}>{paymentStatus}</td>
            <td className="align-middle"><PaymentDropDown id={id} handlePayment={handlePayment} paymentStatus={paymentStatus}/></td>
        </tr>
        </>
    )
}

export default DataTransactions
