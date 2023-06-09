// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.18.0
// source: integrations.sql

package database

import (
	"context"
)

const createIntegration = `-- name: CreateIntegration :one
INSERT INTO integrations (
  name, owner_id
) VALUES (
  ?, ?
) RETURNING id, name, owner_id, created_at, updated_at
`

type CreateIntegrationParams struct {
	Name    string `json:"name"`
	OwnerID string `json:"owner_id"`
}

func (q *Queries) CreateIntegration(ctx context.Context, arg CreateIntegrationParams) (Integration, error) {
	row := q.db.QueryRowContext(ctx, createIntegration, arg.Name, arg.OwnerID)
	var i Integration
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.OwnerID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const createIntegrationPermission = `-- name: CreateIntegrationPermission :one
INSERT INTO integration_permissions (
 integration_id, achievement_bundle_id, achievement_id
) VALUES (
  ?, ?, ?
) RETURNING id, integration_id, achievement_bundle_id, achievement_id, created_at
`

type CreateIntegrationPermissionParams struct {
	IntegrationID       int64     `json:"integration_id"`
	AchievementBundleID NullInt64 `json:"achievement_bundle_id"`
	AchievementID       NullInt64 `json:"achievement_id"`
}

func (q *Queries) CreateIntegrationPermission(ctx context.Context, arg CreateIntegrationPermissionParams) (IntegrationPermission, error) {
	row := q.db.QueryRowContext(ctx, createIntegrationPermission, arg.IntegrationID, arg.AchievementBundleID, arg.AchievementID)
	var i IntegrationPermission
	err := row.Scan(
		&i.ID,
		&i.IntegrationID,
		&i.AchievementBundleID,
		&i.AchievementID,
		&i.CreatedAt,
	)
	return i, err
}

const getAllIntegrations = `-- name: GetAllIntegrations :many
SELECT id, name, owner_id, created_at, updated_at FROM integrations
`

func (q *Queries) GetAllIntegrations(ctx context.Context) ([]Integration, error) {
	rows, err := q.db.QueryContext(ctx, getAllIntegrations)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Integration
	for rows.Next() {
		var i Integration
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.OwnerID,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
