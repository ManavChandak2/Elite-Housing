import { auth } from 'express-oauth2-jwt-bearer'

const jwtCheck = auth({
    audience: "http://localhost:8000/",
    issuerBaseURL: "https://dev-qc07t4k5n8zq8trx.us.auth0.com",
    tokenSigningAlg: "RS256" //default method
})

export default jwtCheck