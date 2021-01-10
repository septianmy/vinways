import {useContext, useState, useEffect} from 'react';
import {AppContext} from '../../context/appContext';
import { API, Port } from "../../config/api";
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import {Header, Button, DataTransactionsUser} from "../../components";
import {UserDefaultPict} from "../../assets";
import './profile.scss';

const ProfileUser = () => {
    const [state] = useContext(AppContext);
    const { user } = state;
    const [transactions, setTransactions] = useState([]);
    const [profile, setProfile] = useState([]);

    const fetchProfile = async () => {
        try {
            const response = await API(`/user/${user.id}`);
            if(response.status === 500){
                console.log("Server Error");
            }
            setProfile(response.data.data.user);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchTransactions = async () => {
        try {
            const response = await API(`/fetch-transaction-user/${user.id}`);
            if(response.status === 500){
                console.log("Server Error");
            }
            setTransactions(response.data.data.transactions);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        fetchProfile();
        fetchTransactions();
    },[]);

    return (
        <div className="profile-user">
            <Header/>
            <div className="container mt-3">
                <div className="row">
                    <div className="page-title">Welcome {profile.fullName}</div>
                </div>
                <div className="row">
                    <div className="col-4">
                        {
                            profile.profilePicture !== null ? 
                            <><img src={`${Port}/${profile.profilePicture}`} alt="Profile Image" className="profilePicture"></img></> : 
                            <><img src={UserDefaultPict} alt="Profile Image"></img></>
                        }
                        
                    </div>
                    <div className="col-8">
                        <div className="row page-title">Data Profile</div>
                        <div className="row mt-4">
                            <div className="col-4">Username</div>
                            <div className="col-8">: {profile.email}</div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-4">Fullname</div>
                            <div className="col-8">: {profile.fullName}</div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-4"><Link to="/editprofile"><Button title="Edit Profile"></Button></Link></div>
                            <div className="col-4"><Link to="/editpassword"><Button title="Change Password"></Button></Link></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-3">
                <div className="row">
                    {
                        transactions.length !== 0 ? 
                        <>
                        <div className="page-title">List of Transactions</div>
                        <Table striped hover>
                        <thead>
                            <tr>
                            <th>No</th>
                            <th className="text-center">Proof of Transfer</th>
                            <th>Date Time</th>
                            <th className="text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction,number) =>(
                                <DataTransactionsUser 
                                    number = {number}
                                    transaction = {transaction}
                                />
                            ))}
                        </tbody>
                        </Table>
                        </>
                        :
                        <>
                            <div className="page-title">No Transactions</div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProfileUser
