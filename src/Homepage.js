import './Homepage.css';

const Homepage = () => {
    return ( 
        <div className="homepage">

            <div className="middleLogo">
                <h3>Version 5.0</h3>
            </div>

            <div className='topWrapper'>
                <div className='topRight'>
                    <h3>Thermoforming Systems, LLC</h3>
                    <p><a href="http://www.tslusa.biz/">www.tslusa.biz</a></p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="infoTabs">

                <div className="formerInfo">
                    <h3>Former</h3>
                    <p>SR#1358</p>
                    <div className="formerInfoTabs">
                        <p>Total Cycle Time</p>
                        <p className='formerInfoTabNum' id="totCycleTime">3.51</p>
                    </div>
                    <div className="formerInfoTabs">
                        <p>Cycles Per Minute</p>
                        <p className='formerInfoTabNum' id="formerInfoTabs">17.08</p>
                    </div>
                    <div className="formerInfoTabs">
                        <p>Total Cycles</p>
                        <p className='formerInfoTabNum' id="formerInfoTabs">14672570</p>
                    </div>
                    <div className="formerInfoTabs">
                        <p>Cycles This Shift</p>
                        <p className='formerInfoTabNum' id="formerInfoTabs">13191889</p>
                    </div>
                    <div className="formerInfoTabs">
                        <p>Cabinet Temp</p>
                        <p className='formerInfoTabNum' id="formerInfoTabs">76</p>
                    </div>
                    <div className="formerInfoTabs">
                        <p>Ambient Temp</p>
                        <p className='formerInfoTabNum' id="formerInfoTabs">90</p>
                    </div>
                    <button>Version Info...</button>
                </div>
                <div className="navButtons">
                    <div className="middleButtons">
                        <button className='signIn'>Sign-In</button>

                        <div className="utilButtons">
                            <div className="chat">Enter Chat</div>
                            <div className="notes">Process Notes</div>
                        </div>
                    </div>
                </div>
                <div className="formerInfo">
                    <h3>Trim</h3>
                    <p>SR#1358</p>

                        <div className="formerInfoTabs">
                            <p>Cycles Per Minute</p>
                            <p className='formerInfoTabNum' id="formerInfoTabs">17.08</p>
                        </div>
                        <div className="formerInfoTabs">
                            <p>Total Cycles</p>
                            <p className='formerInfoTabNum' id="formerInfoTabs">14672570</p>
                        </div>
                        <div className="formerInfoTabs">
                            <p>Cycles This Shift</p>
                            <p className='formerInfoTabNum' id="formerInfoTabs">13191889</p>
                        </div>
                        <div className="formerInfoTabs">
                            <p>Cabinet Temp</p>
                            <p className='formerInfoTabNum' id="formerInfoTabs">76</p>
                        </div>
                    

                </div>
            </div>


        </div>
     );
}
 
export default Homepage;