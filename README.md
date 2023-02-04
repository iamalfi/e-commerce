# E-commerce API

This API has two User

1. Admin = The one who can do all operations like fetch,create,update and delete products
2. Basic User = The one who can only get products, add to cart and order them

## Endpoints

## ADMIN API

### List of products

BASE_URL = `http://localhost:2000/admin`

GET `/getproducts`

Returns all products.

### Create a product

POST `/admin/product`

Allows only admin can create a new product. Requires authentication and authorisation.

The request body needs to be in JSON format and include the following properties:

-   `title` - String- Required
-   `imageUrl` - String - Required
-   `description` - String- Required
-   `price` - Number - Required

Example

```
POST /product
Authorization: Bearer <YOUR TOKEN>
{
    "title": "margrete pizza",
    "imageUrl": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description": "buy 1 get 1 free",
    "price": 300,
}
```

The response body will contain the following object.

```
{
     "status": true,
    "products": [
        {
            "_id": "63c96f9c12eb1720cf264fe3",
            "title": "margrete pizza",
            "imageUrl": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "description": "buy 1 get 1 free",
            "price": 300,
            "createdAt": "2023-01-19T16:28:12.900Z",
            "updatedAt": "2023-01-19T17:23:29.723Z",
            "__v": 0
        },
}
```

### Update a product

PUT `/update/:productId`

Update an existing product. Requires authentication and authorisation.

The request body needs to be in JSON format and allows you to update the following properties:
You do not need to give all the input fields in the body request, what field you want to update just write down like below.

-   `title` - String- Required
-   `price` - Number - Required

Example

```
PUT /updateproduct/63c96f9c12eb1720cf264fe3
Authorization: Bearer <YOUR TOKEN>
{
  "title": "car",
  "price": 500
}
```

### Delete a product

DELETE `/deleteproduct/:productId`

Delete an existing product. Requires authentication and authorisation.

The request body needs to be empty.

Example

```
DELETE /deleteproduct/63c96f9c12eb1720cf264fe3
Authorization: Bearer <YOUR TOKEN>
```

## CUSTOMER API

BASE_URL = `http://localhost:2000/customer`

### List of products

GET `/getproducts`

Returns all products.

### Get a single product

GET `/get-product/:productId`

Retrieve detailed information about a product.

### Add to cart product

PUT `/add-to-cart/:productId`

This will add product into your cart

### Delete cart from product

DELETE `/delete-cart/:productId`

## API Authentication

To perform any operation, you need to register and then login.

Base_URL = `http://localhost:2000/user`

### SIGNUP

POST `/signup`

The request body needs to be in JSON format and include the following properties:

-   `name` - String
-   `email` - String
-   `password` - String
-   `address` - String
-   `mobile` - Number

Example

```
{
   "username": "smith",
   "email": "example@gmail.com"
   "password": "pass@123",
   "address": "2nd Street",
   "mobile": 9943435344
}
```

Note. When you signup, you will get an email to verify your account.
Without verifying your account you can not login.

### LOGIN

POST `/login`

The request body needs to be in JSON format and include the following properties:

-   `email` - String
-   `password` - String

Example

```
{
   "email": "example@gmail.com"
   "password": "pass@123"
}
```

The response body will contain the access token and other information about user. The access token is valid for 1 hour.

**Possible errors**

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 401         | `UNAUTHORIZED`          |
| 422         | `VALIDATION ERROR`      |
| 500         | `INTERNAL SERVER ERROR` |
