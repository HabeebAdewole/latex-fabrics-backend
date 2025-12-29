// hash refresh tokens
// rewrite the file to include hashing of refresh tokens before storing them in the database
// rewrite parts of otp handling 
//hash otp with purpose in redis key and also before storing in redis
// make changes to the db and migrate e.g uuid for refresh token id and @unique for token field