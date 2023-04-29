-- name: CreateAchievement :one
INSERT INTO achievements (
  name, description, image_url, bundle_id, owner_id
) VALUES (
  ?, ?, ?, ?, ?
) RETURNING *;
