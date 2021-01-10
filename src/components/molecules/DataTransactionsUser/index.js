import dateFormat from 'dateformat';
import { Port } from "../../../config/api";
const DataTransactionsUser = ({transaction,number}) => {
    let numbering = number + 1;
    return (
        <>
        <tr>
            <td className="align-middle">{numbering}</td>
            <td width="25%" className="text-center">
                <img 
                    src={`${Port}/${transaction.proofTransaction}`}
                    alt={transaction.proofTransaction}
                    className="img-fluid"
                    style={{
                        height:"75px",
                        objectFit: "cover",
                    }}
                    />
            </td>
            <td className="align-middle">
            {dateFormat(transaction.createdAt, "dddd, mmmm dS, yyyy")}
            </td>
            <td className="align-middle text-center">{transaction.paymentStatus}</td>
        </tr>
        </>
    )
}

export default DataTransactionsUser