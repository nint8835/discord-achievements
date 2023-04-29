package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"

	"github.com/nint8835/discord-achievements/pkg/config"
)

func Connect() (*Queries, error) {
	db, err := sql.Open("sqlite3", config.Instance.DBPath)
	if err != nil {
		return nil, err
	}

	return New(db), nil
}
