URLShortner Project - Converts long URLs into shorter, more manageable links.

SETUP -- >

1.Copy the project in the local system
2.Enter the MongoDB URL in the server.js file
3.Test the API's


Initial Project Contains 2 API's - 
1. POST Request -->
http://localhost:3000/shorten - For converting a URL into a shortURL
Body Required containing the URL to be shortened (example) - 
{
    "originalUrl": "https://github.com/"
}

2. GET Request -->
http://localhost:3000/:shortUrl - Passing the shorten URL redirects to the original URL
