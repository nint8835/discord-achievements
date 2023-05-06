-- name: CreateUser :one
INSERT INTO users (
   id, username, avatar_url
) VALUES (
    ?, ?, ?
 ) RETURNING *;

-- name: GetAllUsers :many
SELECT * FROM users;

-- name: CreateOrUpdateUser :one
INSERT OR REPLACE INTO users (
   id, username, avatar_url
) VALUES (
    ?, ?, ?
 ) RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE id = ? LIMIT 1;