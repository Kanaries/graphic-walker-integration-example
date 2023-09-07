import os


class Settings:
    SERVER_NAME = "gw-service"
    ENV = os.getenv("ENV", "dev")

    PG_USER = os.getenv("CUBE_USER", "")
    PG_PASSWORD = os.getenv("CUBE_PASSWORD", "")
    PG_HOST = os.getenv("CUBE_HOST", "")
    PG_PORT = os.getenv("CUBE_PORT", 5679)
    PG_DBNAME = os.getenv("CUBE_DB", "")
    PG_ECHO = os.getenv("PG_ECHO", False)
    PG_ECHO_POOL = os.getenv("PG_ECHO_POOL", False)
    PG_DSN = (
        f"postgresql+psycopg://{PG_USER}:{PG_PASSWORD}"
        f"@{PG_HOST}:{PG_PORT}/{PG_DBNAME}"
    )


config = Settings()
