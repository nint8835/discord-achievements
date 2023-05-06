package database

import (
	"context"
	"database/sql"

	"github.com/bwmarrin/discordgo"
)

func StringToNullString(s string) sql.NullString {
	return sql.NullString{String: s, Valid: s != ""}
}

// CreateOrUpdateDiscordUser creates or updates a user in the database based on the given discordgo.User
func CreateOrUpdateDiscordUser(ctx context.Context, user *discordgo.User) (User, error) {
	return Instance.CreateOrUpdateUser(ctx, CreateOrUpdateUserParams{
		ID:        user.ID,
		Username:  user.Username,
		AvatarUrl: user.AvatarURL(""),
	})
}
