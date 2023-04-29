-- name: CreateIntegration :one
INSERT INTO integrations (
  name, owner_id
) VALUES (
  ?, ?
) RETURNING *;

-- name: GetAllIntegrations :many
SELECT * FROM integrations;

-- name: CreateIntegrationPermission :one
INSERT INTO integration_permissions (
 integration_id, achievement_bundle_id, achievement_id
) VALUES (
  ?, ?, ?
) RETURNING *;
