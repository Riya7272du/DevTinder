## authRouter

POST/auth/signup
POST/auth/login
POST/auth/logout

## profileRouter

GET/profile/view
PATCH/profile/edit
PATCH/profile/password

## ConnectionRequestRouter

<!-- dynamic for interseted and ignored based on status -->

POST/request/send/:status/:userId

<!-- POST/request/send/interested/:userId
POST/request/send/ignored/:userId -->

<!-- dynamic for interseted and ignored based on status -->

POST/request/review/:status/:requestId

<!-- POST/request/review/accepted/:requestId
POST/request/review/rejected/:requestId -->

## userRouter

GET/user/connections
GET/user/requests/recieved
GET/user/feed - Gets you the profiles of other users on platform
