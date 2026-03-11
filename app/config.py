from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "frankBread API"
    debug: bool = False
    database_url: str = "postgresql://postgres:1235@localhost:5432/bread_ordering_db"

    class Config:
        env_file = ".env"


settings = Settings()
