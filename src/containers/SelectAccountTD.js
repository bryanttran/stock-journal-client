import { Auth } from "aws-amplify";
import React, { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { useHistory} from 'react-router';
import { Button, Form } from "react-bootstrap";
import "./SelectAccountTD.css";

export default function SelectAccountTD(){
    const tdCookie = new Cookies();
    const history = useHistory();
    const acctList = JSON.parse(localStorage.getItem("acctList") || "[]");

    const [acctNum, setAcctNum] = useState(acctList[0]);

    const options = acctList.map((opt) => {
        return( <> <option key={opt} value={opt} >{opt}</option> </>);
    });

    useEffect(() => {
        checkAuth();
    }, [])

    async function checkAuth() {
        const cookieValue = tdCookie.get("tdauth");
        console.log(cookieValue);
        console.log(acctList);
        
        if(cookieValue) {
            try{
                let res = await Auth.currentAuthenticatedUser();
                console.log(res);
            } catch(e) {
                alert(e);
                history.push("/");
            }
        }
    }

    function premiumText(){
        return (<h2>There are more than one accounts linked to your TD Ameritrade account. Select and account to view trades.</h2>)
    }


    async function handleSubmit(event) {
        event.preventDefault();
        console.log(acctNum);
        localStorage.setItem("selectedAccount", acctNum);
        history.push({
            pathname: '/',
            state: { acctNum: acctNum}
        });
      }

    return(
        <div>
            {premiumText()}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control size="lg" as="select" onChange={(e) => setAcctNum(e.currentTarget.value)}>
                        {options}
                    </Form.Control>
                    <Button
                        className="float-right select-account-button"
                        size="lg"
                        type="submit"
                    >Select account</Button>
                </Form.Group>
            </Form>
        </div>
    )
}