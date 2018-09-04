FORMAT: 1A

# andela_vlf_test
This the api for a lighter version of stackoverflow, it allows users post questions, answer questions..

HOST_LOCALLY = http://localhost:5000/api/v1

#Group Authentication

##Authentication Collection [/auth]

## Sign up a user[/auth/signup]

### Sign up a user [POST]

+ Request (application/json)
    ```
        {
            "username": "username", 
            "email": "example@email.com", 
            "password": "password"
        }
    ```

+ Response 200(application/json)

    + Headers 
        This contains a token to use when making any request to the endpoinst below..
    ```
        x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmZjUwNWY4LTY3YmMtNDAyOS04NmZkLWExM ............
    ```

    + Body 
        ```
            {
                "status": "success",
                "data": {
                    "id": "5b534e71-b67b-40eb-aea8-9059a368197d",
                    "username": "username",
                    "email": "example@email.com"
                }
            }
        ```
