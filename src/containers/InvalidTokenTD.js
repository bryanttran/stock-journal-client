import Button from 'react-bootstrap/Button';

export default function InvalidTokenTD() {
    const URL = process.env.REACT_APP_TD_URL;

    function isSubscribed() {
        return (localStorage.getItem("tier") === "pro" || localStorage.getItem("tier") === "pre") ? 
          <Button href={URL}>
            Login with TD
          </Button> 
         : "";
    }

    return(
        <div>
            <h4>Something went wrong, pleast log in with your TD Ameritrade account again.</h4>
            {isSubscribed()}
        </div>
    )
}