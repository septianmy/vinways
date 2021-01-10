import {Header, DataTransactions} from '../../components';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/appContext';
import { API } from "../../config/api";
import { useHistory} from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import './transactions.scss';

const Transactions = () => {
    const [state,dispatch] = useContext(AppContext);
    const [transactions, setTransactions] = useState([]);
    const router = useHistory();
    const fetchTransactions = async () => {
        try {
            const response = await API("/transactions");
            if(response.status === 500){
                console.log("Server Error");
            }
            setTransactions(response.data.data.transactions);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment = async (id, typeAction) => {
        const body = JSON.stringify({id,paymentStatus:typeAction});
        const config = {
            headers: {
                "Content-Type":"application/json",
            },
        };
        try {
            const response = await API.patch(`/transaction/${id}`, body, config);
            fetchTransactions();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchTransactions();
    },[]);

    return (
        <div className="transactions-page">
            <Header/>
            <div className="container mt-3">
                <div className="row">
                    <div className="page-title">Incoming Transactions</div>
                    <Table striped  hover>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th className="text-center">Users</th>
                        <th className="text-center">Proof Transaction</th>
                        <th className="text-center">Remaining Active</th>
                        <th className="text-center">Status User</th>
                        <th className="text-center">Status Payment</th>
                        <th className="d-flex justify-content-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactions.map((transaction, number) => (
                                <DataTransactions
                                    number = {number} 
                                    transaction = {transaction}
                                    key={transaction.id}
                                    handlePayment={handlePayment} 
                                />
                            ))
                        }
                    </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Transactions
