import React, {useContext, useState} from 'react';
import {AppContext} from "../../context/appContext";
import {API} from "../../config/api";
import {useHistory, Link} from 'react-router-dom';
import { Header, Input, Button, InputFile} from '../../components';
import Modal from 'react-bootstrap/Modal'
import './makepayment.scss';

    const MakePayment = () => {
        const [state, dispatch] = useContext(AppContext);
        const [modalShow, setModalShow] = React.useState(false);
        const [validationModal, setValidationModal] = React.useState(false);
        const router = useHistory();
        const [proofTransaction, setProofTransaction] = useState('');
        const [formData, setFormData] = useState({
            userId: state.user.id,
            accountNumber: "",
        });
        const [inputMessage, setInputMessage] = useState('');
        const {userId, accountNumber} = formData;

        const handlePayment = async (e) => {
            e.preventDefault();
            try {
                const formAddTransaction = new FormData();
                formAddTransaction.append("proofTransaction", proofTransaction);
                formAddTransaction.append("accountNumber", accountNumber);

                const config = {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                };
                const response = await API.post(`/transaction/${userId}`, formAddTransaction, config);
                setModalShow(true);
                
            } catch (error) {
                if(error.response.status === 400){
                    setValidationModal(true);
                    setInputMessage(error.response.data.error);
                }
            }
        };

        const handleChange = (e) => {
            const updateForm = {...formData};
            updateForm[e.target.name] = e.target.type === "file" ? e.target.files[0] : e.target.value;
            setFormData(updateForm);
        };

        const handleProofTransaction = (e) => {
            setProofTransaction(e.target.files[0]);
        }
    
        function PaymentSuccess(props) {
            return (
              <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body className="make-payment">
                <Link to="/">
                <p>
                    Thank you for subscribing to premium, your premium package will be active after our admin approves your transaction, thank you
                </p>
                </Link>
                </Modal.Body>
              </Modal>
            );
          };
        
        function InputValidation(props) {
            return (
              <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Body className="make-payment">
                    {
                        inputMessage.message !== undefined &&
                        inputMessage.message.map((message) => (
                        <p>{message}</p>
                        ))
                    } 
                </Modal.Body>
              </Modal>
            );
        };
      

    return (
        <div className="make-payment-page">
            <Header/>
            <div className="container d-flex align-items-center" style={{ height:"70vh"}}>
                <div style={{ width:"100%"}}>
                    <div className="row d-flex justify-content-center title">
                        <div className="section-title green">Premium</div>
                    </div>
                    <div className="row d-flex justify-content-center caption">
                        Bayar sekarang dan nikmati streaming music yang kekinian dari Co &nbsp;<span className="green"> Ways</span>
                    </div>
                    <div className="row d-flex justify-content-center co-ways-number">
                        Co&nbsp;<span className="green"> Ways</span> : 0981312323
                    </div>
                    <form onSubmit={(e) => handlePayment(e)}>
                    <div className="row d-flex justify-content-center">
                        <div className="col-4">
                            <input 
                                type="hidden" 
                                name="userId" 
                                value={userId} 
                                onChange={(e) => handleChange(e)}
                            />
                            <Input 
                                placeholder="Input your account number"
                                name="accountNumber" 
                                value={accountNumber} 
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                        <div className="col-4">
                            <InputFile 
                                prop={proofTransaction.name}
                                id="file"
                                attach="Attach proof of transfer" 
                                name="proofTransaction" 
                                onChange={(e) => handleProofTransaction(e)}
                            />
                        </div>
                    </div>
                    {
                        proofTransaction !== '' &&
                        <>
                        <div className="row d-flex justify-content-center">
                            <div className="col-4">
                                <img src={URL.createObjectURL(proofTransaction)} alt={proofTransaction.name} className="img-preview"></img>
                            </div>
                        </div>
                        </>
                    }
                    <div className="row d-flex justify-content-center send-payment">
                        <Button title="Send" type="submit"/>
                    </div>
                    </form>
                </div>
            </div>
            <PaymentSuccess
            show={modalShow}
            onHide={() => setModalShow(false)}
            />
            <InputValidation
            show={validationModal}
            onHide={() => setValidationModal(false)}
            />
        </div>
    )
}

export default MakePayment
