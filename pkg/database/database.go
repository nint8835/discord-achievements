package database

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"

	"github.com/nint8835/discord-achievements/pkg/config"
)

var Instance *Queries

func Connect() error {
	db, err := sql.Open("sqlite3", config.Instance.DBPath)
	if err != nil {
		return err
	}

	Instance = New(db)

	return nil
}
