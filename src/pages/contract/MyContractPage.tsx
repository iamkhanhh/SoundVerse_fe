import React, { useEffect } from 'react';
import './css/ContractPage.css';
import { useMusicStore } from '@/stores/useMusicStore';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

const MyContractPage = () => {
  const { myContract, fetchMyContract } = useMusicStore();

  useEffect(() => {
    console.log("khanhkhanh")
    fetchMyContract();
  }, [fetchMyContract])

  const exportContract = async () => {
    try {
      const response = await axiosInstance.get('/contract/export-contract');

      if (response.data.status === 'success') {
        const downloadUrl = response.data.data;

        if (downloadUrl) {
          window.open(downloadUrl, '_blank');

          toast.success("File downloading...");
        } else {
          toast.error("Không nhận được URL tải về!");
        }
      } else {
        toast.error(response.data.message || "Unknown Error!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unknown Error!");
    }
  };


  return (
    <ScrollArea className='h-[calc(100vh-180px)] overflow-y-auto'
      style={{
        scrollbarWidth: 'thin', /* Dùng cho Firefox */
        scrollbarColor: '#0f0f0f transparent', /* Màu thanh cuộn */
        paddingBottom: '50px'
      }}>
      <div className='container text-right'>
        <Button
          variant={"ghost"}
          size={"lg"}
          className='text-green-400 hover:text-green-300 hover:bg-green-400/10 cursor'
          onClick={exportContract}
        >
          <Download className='size-4' />
          DOWNLOAD
        </Button>
      </div>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
          <img src="/logo.png" alt="Sound Verse Logo" className="logo" />

          <h1>Music Distribution Contract</h1>
        </div>

        <div className="contract-info">
          <h2>Contract Information</h2>
          <p>Contract Number: <span id="contractNumber">{myContract ? myContract.contractNumber : "Loading..."}</span></p>
          <p>Contract Date: <span id="contractDate">{myContract ? myContract.contractDate : "Loading..."}</span></p>
          <p>Contract Term: <span id="contractTerm">1 year</span></p>
        </div>

        <div className="artist-info" style={{ marginTop: '12px' }}>
          <h2>Artist</h2>
          <p>Artist Name: {myContract ? myContract.username : "Loading..."}</p>
          <p>Address: {myContract ? myContract.address : "Loading..."}</p>
          <p>Phone Number: {myContract ? myContract.phone : "Loading..."} </p>
          <p>Email: {myContract ? myContract.email : "Loading..."}</p>
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
              className='dancing-script-font'
              style={{ textAlign: 'center', fontSize: '30px' }}
            >
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
            <p
              className='dancing-script-font'
              style={{ textAlign: 'center', fontSize: '30px' }}
            >
              {myContract ? myContract.signature : "Loading..."}
            </p>
            <div className="signature">
              <p>{myContract ? myContract.username : "Loading..."}</p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>

  );
};

export default MyContractPage;