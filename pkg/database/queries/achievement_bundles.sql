-- name: CreateAchievementBundle :one
INSERT INTO achievement_bundles (
  name, description, image_url, owner_id
) VALUES (
  ?, ?, ?, ?
 ) RETURNING *;

-- name: GetAllAchievementBundles :many
SELECT * FROM achievement_bundles;

-- name: GetAchievementBundlesOwnedByUser :many
SELECT * FROM achievement_bundles WHERE owner_id = ?;