export function isTokenValid(response) {
    if(response) {
        if(response.atoken) {
            console.log("updating atoken");
            localStorage.setItem("atoken", response.atoken);
        }
        if(response.invalidRecord) { // Checks for invalid record, needing to login with TD again
            return false;
        }
    }
    return true;
}