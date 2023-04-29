-- name: CreateUser :one
INSERT INTO users (
   id, username, discriminator, avatar_url
) VALUES (
    ?, ?, ?, ?
 ) RETURNING *;

-- name: GetAllUsers :many
SELECT * FROM users;