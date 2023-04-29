-- name: CreateAchievement :one
INSERT INTO achievements (
  name, description, image_url, is_unique, bundle_id, owner_id
) VALUES (
  ?, ?, ?, ?, ?, ?
) RETURNING *;

-- name: GetAllAchievements :many
SELECT * FROM achievements;

-- name: CreateEarnedAchievement :one
INSERT INTO earned_achievements (
  achievement_id, user_id
) VALUES (
  ?, ?
) RETURNING *;
