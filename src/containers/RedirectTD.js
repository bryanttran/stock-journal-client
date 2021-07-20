import React, { useEffect } from 'react';
import { API } from "aws-amplify";
import { useHistory } from 'react-router';

export default function RedirectTD() {
    const history = useHistory();
    useEffect(() => {
        async function getTDAuthentication() {
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let code = encodeURIComponent(params.get('code'));
            console.log(code);
            let tier = localStorage.getItem("tier");
            console.log(tier);
            let paramsAuth = {
                body: {
                    "code": code,
                    "userTokenId": localStorage.getItem("userTokenId") || null,
                    "tier": tier,
                },
            };
            console.log(paramsAuth);
            try {
                let response = await API.post("getCodeTD", "/getCodeTD", paramsAuth);
                console.log(response);
                if(response.atoken) {
                    localStorage.setItem("atoken", response.atoken);
                }
                if(response.rtoken) {
                    localStorage.setItem("rtoken", response.rtoken);
                }
                if(response.userTokenId) { // New user token id
                    localStorage.setItem("userTokenId", response.userTokenId);
                }
                let acctResponse = await API.put("getAcctTD", "/getAcctTD", {
                    body: {
                        "tier": tier,
                        "atoken": response.atoken,
                        "rtoken": response.rtoken,
                        "userTokenId": localStorage.getItem("userTokenId"),
                    }
                });
                console.log(acctResponse);
                //localStorage.setItem("userTokenId", JSON.stringify(acctResponse.newUserToken));
                //setAcctList(acctResponse.acctList); // Setting account list so other containers can access. 
                localStorage.setItem("acctList", JSON.stringify(acctResponse.acctList));
                if(acctResponse.acctList && acctResponse.acctList.length > 1) {
                    history.push("/selectAccountTD");
                } else {
                    localStorage.setItem("selectedAccount", acctResponse.acctList[0]);
                    history.push("/");
                }
            } catch (e) { 
                alert(e);
                history.push("/");
            }
        }
        getTDAuthentication();
    }, [])


    return (<></>)
}