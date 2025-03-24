import React, { useEffect, useState } from 'react';
import './css/ContractPage.css';
import { useAuth } from '@/providers/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader, Signature } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';

const ContractPage = () => {
    const navigate = useNavigate();
    const { user, getCurrentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    console.log(user)

    // if (!user) return <p>Loading...</p>; 

    const generateContractNumber = (userId) => {
        const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const today = new Date();
        const dayOfWeek = daysOfWeek[today.getDay()];
        const formattedUserId = userId.toString().padStart(6, "0");
        return `SV${dayOfWeek}${formattedUserId}`;
    };

    const getCurrentDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const [form, setForm] = useState({
        username: user.username,
        phone: "",
        address: "",
        contractNumber: generateContractNumber(1),
        contractDate: getCurrentDate(),
        signature: "",
        email: user.email
    });

    const handleContentChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.innerText });
    };

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (form.signature === "") {
            toast.error("Please sign the contract before submitting!");
            return;
        }
        
        try {
            const response = await axiosInstance.post('/contract/sign-contract', form);

            if (response.data.status == 'success') {
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Unknown Error!");
        }
        setIsLoading(false);
    };

    return (
        <div className='wrapper-container'>
            <div className="container">
                <img src="/logo.png" alt="Melody Wave Logo" className="logo" />

                <h1>Music Distribution Contract</h1>

                <div className="contract-info">
                    <h2>Contract Information</h2>
                    <p>Contract Number: <span id="contractNumber">SVTUE000001</span></p>
                    <p>Contract Date: <span id="contractDate">{getCurrentDate()}</span></p>
                    <p>Contract Term: <span id="contractTerm">1 year</span></p>
                </div>

                <div className="artist-info">
                    <h2>Artist</h2>
                    <p>Artist Name: {user?.username || user?.fullname || ""}</p>
                    <p style={{ display: 'flex', alignItems: 'center' }}>Address:
                        <p
                            contentEditable='true'
                            suppressContentEditableWarning={true}
                            style={{ textAlign: 'center', border: '1px dashed #c9c9c9', flex: '1', marginLeft: '16px' }}
                            onBlur={handleContentChange("address")}
                        >
                            {form.address}
                        </p>
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center' }}>Phone Number:
                        <p
                            contentEditable='true'
                            style={{ textAlign: 'center', border: '1px dashed #c9c9c9', flex: '1', marginLeft: '16px' }}
                            onBlur={handleContentChange("phone")}
                        >
                            {form.phone}
                        </p>
                    </p>
                    <p>Email: {form.email}</p>
                </div>

                <div className="distributor-info">
                    <h2>Distributor</h2>
                    <p>Company Name: Sound Verse</p>
                    <p>Address: Nghiem Xuan Yem, Dai Kim, Hoang Mai, Ha Noi, Viet Nam</p>
                    <p>Represented by: Vo Van Kien</p>
                    <p>Position: Chief Operations Officer</p>
                </div>

                <p>The parties agree to the following terms:</p>

                <div className="section">
                    <h2>1. SCOPE OF WORK</h2>
                    <ul>
                        <li>The Artist grants the Distributor exclusive rights to distribute and sell their music recordings through
                            digital platforms.</li>
                        <li>The Distributor is responsible for promoting and maximizing sales efforts.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>2. TERM</h2>
                    <ul>
                        <li>This Agreement is effective from the signing date and lasts for one (1) year.</li>
                        <li>The Agreement will automatically renew for an additional one (1) year unless either party provides written
                            notice of non-renewal at least thirty (30) days before the current term expires.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>3. RIGHTS AND OBLIGATIONS OF THE PARTIES</h2>
                    <h4><strong>3.1. Artist</strong></h4>
                    <ul>
                        <li>Ensures that all provided music recordings do not infringe on third-party copyrights.</li>
                        <li>Provides all necessary information and materials to support distribution.</li>
                    </ul>
                    <h4><strong>3.2. Distributor</strong></h4>
                    <ul>
                        <li>Distributes the recordings on digital platforms according to industry standards.</li>
                        <li>Provides regular revenue reports to the Artist.</li>
                        <li>Pays the Artist a percentage of the revenue earned after deducting reasonable expenses.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>4. PAYMENT</h2>
                    <ul>
                        <li>The Artist shall receive 65% of the revenue from their distributed recordings after deducting reasonable
                            expenses.</li>
                        <li>The Distributor shall make payments to the Artist on a Monthly basis, no later than five (5) days after the
                            end of each payment cycle.</li>
                        <li>Payments will be made via Bank Transfer.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>5. DISPUTE RESOLUTION</h2>
                    <ul>
                        <li>Any disputes arising out of or related to this Agreement shall be resolved through mediation in the state of
                            New York.</li>
                        <li>If mediation fails, the parties agree to submit disputes to binding arbitration under the rules of the
                            American Arbitration Association.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>6. MISCELLANEOUS</h2>
                    <ul>
                        <li>This Agreement constitutes the entire understanding between the parties and supersedes any prior agreements.
                        </li>
                        <li>Any modifications to this Agreement must be in writing and signed by both parties.</li>
                        <li>This Agreement shall be governed by the laws of the state of New York.</li>
                        <li>If any provision of this Agreement is deemed invalid or unenforceable, the remaining provisions shall remain
                            in effect.</li>
                    </ul>
                </div>

                <div className="section">
                    <h2>Agreement </h2>
                    <p>By executing this contract, the undersigned parties hereby confirm that they have reviewed, comprehended, and
                        consented to all the terms and conditions delineated herein. This agreement establishes a legally binding
                        contract between the aforementioned parties.</p>
                </div>

                <div className="signature-section">
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <strong>Sound Verse</strong>
                        </div>
                        <p
                            style={{ textAlign: 'center', fontFamily: "'Dancing Script', cursive", fontSize: '30px' }}>
                            Kien Vo
                        </p>
                        <div className="signature">
                            <p>Vo Van Kien</p>
                        </div>
                    </div>
                    <div>
                        <div style={{ textAlign: 'center' }}>
                            <strong>Artist</strong>
                        </div>
                        <p contentEditable='true'
                            style={{ textAlign: 'center', fontFamily: "'Dancing Script', cursive", fontSize: '30px', border: '1px dashed #c9c9c9' }}
                            onBlur={handleContentChange("signature")}
                        >
                            {form.signature}
                        </p>
                        <div className="signature">
                            <p>{user?.username || user?.fullname || ""}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container text-center'>
                <Button
                    variant={"ghost"}
                    size={"lg"}
                    className='text-green-400 hover:text-green-300 hover:bg-green-400/10 cursor'
                    onClick={(e) => handleSubmit(e)}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className="animate-spin size-4 text-green-500" /> : <Signature className='size-4' />}
                    SAVE
                </Button>
            </div>
        </div>
    );
};

export default ContractPage;